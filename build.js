const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const data = JSON.parse(fs.readFileSync(path.join(srcDir, 'data.json'), 'utf8'));
const template = fs.readFileSync(path.join(srcTpl, 'template.html'), 'utf8');
const css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(srcDir, 'script.js'), 'utf8');

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function generateSchedule(talks) {
    let scheduleHtml = '';
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0);

    talks.forEach((talk, index) => {
        const startTime = new Date(currentTime);
        const endTime = new Date(startTime.getTime() + talk.duration * 60000);

        scheduleHtml += `
            <div class="timeslot">
                <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
                <div class="details">
                    <h2>${talk.title}</h2>
                    <div class="speakers">${talk.speakers.join(', ')}</div>
                    <p>${talk.description}</p>
                    <div class="category">
                        ${talk.category.map(c => `<span>${c}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

        if (index === 2) { // After the 3rd talk, add a lunch break
            const lunchStartTime = new Date(currentTime);
            const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
            scheduleHtml += `
                <div class="timeslot break">
                    <div class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
                    <div class="details">
                        <h2>Lunch Break</h2>
                    </div>
                </div>
            `;
            currentTime = lunchEndTime;
        }
    });

    return scheduleHtml;
}

const schedule = generateSchedule(data);

let finalHtml = template.replace('{{SCHEDULE}}', schedule);
finalHtml = finalHtml.replace('{{CSS}}', css);
finalHtml = finalHtml.replace('{{JS}}', js);

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

fs.writeFileSync(path.join(distDir, 'index.html'), finalHtml);

console.log('Website successfully generated!');

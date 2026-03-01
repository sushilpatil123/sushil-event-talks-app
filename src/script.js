document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('category-search');
    const schedule = document.getElementById('schedule');
    const talkSlots = schedule.querySelectorAll('.timeslot:not(.break)');

    function filterTalks() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        talkSlots.forEach(slot => {
            const categories = Array.from(slot.querySelectorAll('.category span')).map(span => span.textContent.toLowerCase());
            const matches = categories.some(category => category.includes(searchTerm));

            if (matches || !searchTerm) {
                slot.style.display = 'flex';
            } else {
                slot.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filterTalks);
});

(function() {
    let widgetApi;

    function init(api) {
        widgetApi = api;

        const button = document.createElement('button');
        button.className = 'sac-reset-button';
        button.innerText = widgetApi.getProperty('buttonText') || 'Reset Filters';

        button.addEventListener('click', () => {
            resetChartFilters();
        });

        widgetApi.getRoot().appendChild(button);
    }

    async function resetChartFilters() {
        try {
            const widgets = await widgetApi.getWidgets();
            const resetLinked = widgetApi.getProperty('resetLinked');

            for (const w of widgets) {
                if (w.type === 'chart') {
                    if (typeof w.resetFilter === 'function') {
                        await w.resetFilter(); // Reset chart-level filters
                    }

                    if (resetLinked && typeof w.getLinkedWidgets === 'function') {
                        const linkedWidgets = await w.getLinkedWidgets();
                        for (const lw of linkedWidgets) {
                            if (lw.type === 'chart' && typeof lw.resetFilter === 'function') {
                                await lw.resetFilter();
                            }
                        }
                    }
                }
            }
            console.log('Chart-level and linked chart filters reset successfully.');
        } catch (err) {
            console.error('Error resetting filters:', err);
        }
    }

    widgetApi.onInit(init);
})();
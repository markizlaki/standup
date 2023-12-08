export const displayClientInfo = (parent, data) => {
    parent.innerHTML += `
    <p class="booking__client-item">Имя: ${data.fullName}</p>
    <p class="booking__client-item">Телефон: ${data.phone}</p>
    <p class="booking__client-item">Номер билета: ${data.ticketNumber}</p>
    `;
};

export const displayBooking = (parent, clientData, comediansData) => {
    const bookingList = document.createElement("ul");
    bookingList.classList.add("booking__list");

    console.log("clientData.booking: ", clientData.booking);

    const bookingComedians = clientData.booking.map((bookingComedian) => {
        const comedian = comediansData.find(
            (item) => item.id === bookingComedian.comedian,
        );

        console.log(comedian);

        const perfomance = comedian.performances.find(
            (item) => item.time === bookingComedian.time,
        );

        console.log(perfomance);

        return {
            comedian,
            perfomance,
        };
    });

    console.log(bookingComedians);

    bookingComedians.sort((a, b) =>
        a.perfomance.time.localeCompare(b.perfomance.time),
    );

    const comedianElements = bookingComedians.map(
        ({ comedian, perfomance }) => {
            const comedianElement = document.createElement("li");
            comedianElement.classList.add("booking__item");
            comedianElement.innerHTML = `
            <h3>${comedian.comedian}</h3>
            <p>Время: ${perfomance.time}</p>
            <button class="booking__hall" type="button"
            data-booking="${clientData.fullName} ${clientData.ticketNumber} ${
                comedian.comedian
            } ${perfomance.time} ${perfomance.hall}">
            ${[perfomance.hall]}
            </button>
            `;
            return comedianElement;
        }
    );

    bookingList.append(...comedianElements);
    parent.append(bookingList);
};

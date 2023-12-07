import Inputmask from "inputmask";
import JustValidate from "just-validate";
import { Notification } from "./Notification";
import { sendData } from "./api";

export const initForm = (
    bookingForm,
    bookingInputFullName,
    bookingInputPhone,
    bookingInputTicket,
    changeSection,
    bookingComediansList
) => {
    const validate = new JustValidate(bookingForm, {
        errorFieldCssClass: "booking__input_invalid",
        successFieldCssClass: "booking__input_valid",
    });

    new Inputmask("").mask(bookingInputFullName);
    new Inputmask("+380(99)-999-99-99").mask(bookingInputPhone);
    new Inputmask("99999999").mask(bookingInputTicket);

    validate
        .addField(bookingInputFullName, [
            {
                rule: "required",
                errorMessage: "Name required",
            },
        ])
        .addField(bookingInputPhone, [
            {
                rule: "required",
                errorMessage: "Phone required",
            },
            {
                validator() {
                    const phone = bookingInputPhone.inputmask.unmaskedvalue();
                    return phone.length === 9 && !!Number(phone);
                },
                errorMessage: "Phone wrong",
            },
        ])
        .addField(bookingInputTicket, [
            {
                rule: "required",
                errorMessage: "Number ticket required",
            },
            {
                validator() {
                    const ticket = bookingInputTicket.inputmask.unmaskedvalue();
                    return ticket.length === 8 && !!Number(ticket);
                },
                errorMessage: "Number ticket wrong",
            },
        ])
        .onFail((fields) => {
            let errorMessage = "";
            for (const key in fields) {
                if (!Object.hasOwnProperty.call(fields, key)) {
                    continue;
                }

                const element = fields[key];
                if (!element.isValid) {
                    errorMessage += `${element.errorMessage}, `;
                }
            }

            Notification.getInstance().show(errorMessage.slice(0, -2), false);
        });

    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validate.isValid) {
            return;
        }

        const data = { booking: [] };
        const times = new Set();

        new FormData(bookingForm).forEach((value, field) => {
            console.log(value, field);
            if (field === "booking") {
                const [comedian, time] = value.split(",");

                if (comedian && time) {
                    console.log(comedian);
                    console.log(time);
                    data.booking.push({ comedian, time });
                    times.add(time);
                }
            } else {
                data[field] = value;
            }
        });

        if (times.size !== data.booking.length) {
            Notification.getInstance().show(
                "You can't be at two shows at the same time",
                false
            );
            return;
        }

        if (!times.size) {
            Notification.getInstance().show("Вы не выбрали комика и/или время");
            return;
        }

        const method = bookingForm.getAttribute("method");

        let isSend = false;

        if (method === "PATCH") {
            isSend = await sendData(method, data, data.ticketNumber);
        } else {
            isSend = await sendData(method, data);
        }

        if (isSend) {
            Notification.getInstance().show("Бронь принята", true);
            changeSection();
            bookingForm.reset();
            bookingComediansList.textContent = '';
        }
    });
};

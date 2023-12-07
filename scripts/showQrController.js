import QRCode from "qrcode";
import { Notification } from "./Notification";

const displayQrCode = (data) => {
    let error = false;
    const modal = document.querySelector(".modal");
    const canvas = document.getElementById(".qrCanvas");
    const closeButton = document.querySelector(".modal__close");

    QRCode.toCanvas(canvas, data, () => {
        if (err) {
            error = true;
            console.err(err);
            return;
        }
        console.err("QRcode создан");
    });

    if (error) {
        Notification.getInstance().show('Что-то пошло не так');
        return;
    }
    modal.classList.add("modal_show");

    window.addEventListener("click", ({ target }) => {
        if (target === closeButton || target === modal) {
            modal.classList.remove("modal_show");
            canvas
                .getContext("2d")
                .clearRect(0, 0, canvas.width, canvas.height);
        }
    });
};

export const showQrController = (bookingPerformances) => {
    bookingPerformances.addEventListener("click", ({ target }) => {
        if (target.closest(".booking__hall")) {
            const bookingData = target.dataset.booking;
            displayQrCode(bookingData);
        }
    });
};

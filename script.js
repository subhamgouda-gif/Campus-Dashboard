document.addEventListener("DOMContentLoaded", () => {
    const todayLabel = document.querySelector("#today-label");
    const dayTabs = Array.from(document.querySelectorAll(".day-tab"));
    const scheduleItems = Array.from(document.querySelectorAll(".schedule-item"));
    const emptySchedule = document.querySelector("#empty-schedule");
    const menuToggle = document.querySelector("#menu-toggle");
    const sidebar = document.querySelector("#sidebar");
    const sidebarScrim = document.querySelector("#sidebar-scrim");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const notificationList = document.querySelector("#notification-list");
    const notificationCount = document.querySelector("#notification-count");
    const emptyNotifications = document.querySelector("#empty-notifications");
    const announcementCount = document.querySelector("#announcement-count");
    const markAllReadButton = document.querySelector("#mark-all-read");
    const announcements = Array.from(document.querySelectorAll(".announcement-card"));
    const dashboardStatus = document.querySelector("#dashboard-status");

    todayLabel.textContent = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    }).format(new Date());

    function selectDay(day) {
        dayTabs.forEach((tab) => {
            const isSelected = tab.dataset.day === day;
            tab.classList.toggle("is-selected", isSelected);
            tab.setAttribute("aria-pressed", String(isSelected));
        });

        let visibleCount = 0;
        scheduleItems.forEach((item) => {
            const isVisible = item.dataset.day === day;
            item.hidden = !isVisible;
            item.classList.remove("is-current");
            if (isVisible) {
                visibleCount += 1;
            }
        });

        const firstVisibleItem = scheduleItems.find((item) => item.dataset.day === day);
        if (firstVisibleItem) {
            firstVisibleItem.classList.add("is-current");
        }
        emptySchedule.hidden = visibleCount > 0;
    }

    dayTabs.forEach((tab) => {
        tab.addEventListener("click", () => selectDay(tab.dataset.day));
    });

    function setMenuOpen(isOpen) {
        sidebar.classList.toggle("is-open", isOpen);
        sidebarScrim.hidden = !isOpen;
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        document.body.classList.toggle("menu-open", isOpen);
    }

    menuToggle.addEventListener("click", () => {
        setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    sidebarScrim.addEventListener("click", () => setMenuOpen(false));

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.forEach((navLink) => navLink.classList.toggle("is-active", navLink === link));
            setMenuOpen(false);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });

    function updateNotificationCount() {
        const count = notificationList.querySelectorAll(".notification-item").length;
        notificationCount.textContent = String(count);
        notificationCount.hidden = count === 0;
        emptyNotifications.hidden = count > 0;
    }

    notificationList.addEventListener("click", (event) => {
        const dismissButton = event.target.closest("[data-dismiss-notification]");
        if (!dismissButton) {
            return;
        }

        const notification = dismissButton.closest(".notification-item");
        const title = notification.querySelector("strong").textContent;
        notification.remove();
        updateNotificationCount();
        dashboardStatus.textContent = `${title} dismissed.`;
    });

    function updateAnnouncementCount() {
        const unreadCount = announcements.filter((announcement) => announcement.dataset.read === "false").length;
        announcementCount.textContent = String(unreadCount);
        announcementCount.hidden = unreadCount === 0;
    }

    markAllReadButton.addEventListener("click", () => {
        announcements.forEach((announcement) => {
            announcement.dataset.read = "true";
            announcement.querySelector(".new-badge").hidden = true;
        });

        updateAnnouncementCount();
        dashboardStatus.textContent = "All announcements marked as read.";
    });

    const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
    selectDay(dayTabs.some((tab) => tab.dataset.day === todayName) ? todayName : "Monday");
    updateNotificationCount();
    updateAnnouncementCount();
});

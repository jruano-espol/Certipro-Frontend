/**
 * Shared "in-system notifications" widget.
 *
 * Wires up any `.header-bell` element found on the page into a clickable
 * bell that opens a dropdown of the current user's notifications
 *
 * Depends on API_UTILS (api_utils.js) already being loaded on the page.
 */

(function () {
    const POLL_INTERVAL_MS = 30000;

    function formatearFechaRelativa(iso) {
        if (!iso) return '';
        const fecha = new Date(iso);
        const ahora = new Date();
        const diffMs = ahora - fecha;
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return 'Justo ahora';
        if (diffMin < 60) return `Hace ${diffMin} min`;
        const diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return `Hace ${diffH} h`;
        const diffD = Math.floor(diffH / 24);
        if (diffD < 7) return `Hace ${diffD} d`;
        return fecha.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' });
    }

    function iconoParaTipo(tipo) {
        if (tipo === 'EVIDENCE_REJECTED') {
            return `<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#e05252" stroke-width="1.8"/>
                <line x1="10" y1="5.5" x2="10" y2="11" stroke="#e05252" stroke-width="1.8" stroke-linecap="round"/>
                <circle cx="10" cy="13.5" r="1" fill="#e05252"/>
            </svg>`;
        }
        return `<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#6b7f9f" stroke-width="1.8"/>
        </svg>`;
    }

    class NotificationBell {
        constructor(bellEl) {
            this.bellEl = bellEl;
            this.dot = bellEl.querySelector('.bell-dot');
            this.notifications = [];
            this.isOpen = false;

            this._buildDropdown();
            this.bellEl.style.cursor = 'pointer';
            this.bellEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.panel.contains(e.target) && !this.bellEl.contains(e.target)) {
                    this.close();
                }
            });
        }

        _buildDropdown() {
            this.bellEl.classList.add('notif-bell-wrapper');

            const panel = document.createElement('div');
            panel.className = 'notif-dropdown hidden';
            panel.innerHTML = `
                <div class="notif-dropdown-header">
                    <span>Notificaciones</span>
                    <button type="button" class="notif-mark-all">Marcar todas como leídas</button>
                </div>
                <div class="notif-dropdown-list"></div>
            `;
            this.bellEl.appendChild(panel);
            this.panel = panel;
            this.listEl = panel.querySelector('.notif-dropdown-list');

            panel.querySelector('.notif-mark-all').addEventListener('click', (e) => {
                e.stopPropagation();
                this.markAllRead();
            });
        }

        async refresh() {
            try {
                this.notifications = await API_UTILS.get('/notifications/');
                this._render();
            } catch (err) {
                console.error('No se pudieron cargar las notificaciones:', err);
            }
        }

        _render() {
            const unreadCount = this.notifications.filter(n => !n.is_read).length;
            if (this.dot) {
                this.dot.style.display = unreadCount > 0 ? '' : 'none';
            }

            if (!this.notifications.length) {
                this.listEl.innerHTML = '<div class="notif-empty">No tienes notificaciones.</div>';
                return;
            }

            this.listEl.innerHTML = this.notifications
                .slice(0, 15)
                .map(n => `
                    <div class="notif-item ${n.is_read ? '' : 'notif-item-unread'}" data-id="${n.id}">
                        <span class="notif-item-icon">${iconoParaTipo(n.notification_type)}</span>
                        <div class="notif-item-body">
                            <div class="notif-item-message">${n.message}</div>
                            <div class="notif-item-time">${formatearFechaRelativa(n.created_at)}</div>
                        </div>
                    </div>
                `).join('');

            this.listEl.querySelectorAll('.notif-item').forEach(el => {
                el.addEventListener('click', () => this.markRead(el.dataset.id));
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.isOpen = true;
            this.panel.classList.remove('hidden');
            this.refresh();
        }

        close() {
            this.isOpen = false;
            this.panel.classList.add('hidden');
        }

        async markRead(id) {
            const notif = this.notifications.find(n => String(n.id) === String(id));
            if (!notif || notif.is_read) return;
            try {
                await API_UTILS.post(`/notifications/${id}/mark_read/`, {});
                notif.is_read = true;
                this._render();
            } catch (err) {
                console.error('No se pudo marcar la notificación como leída:', err);
            }
        }

        async markAllRead() {
            try {
                await API_UTILS.post('/notifications/mark_all_read/', {});
                this.notifications.forEach(n => { n.is_read = true; });
                this._render();
            } catch (err) {
                console.error('No se pudieron marcar todas las notificaciones como leídas:', err);
            }
        }
    }

    function init() {
        const bells = document.querySelectorAll('.header-bell');
        if (!bells.length || typeof API_UTILS === 'undefined') return;

        bells.forEach(bellEl => {
            const bell = new NotificationBell(bellEl);
            bell.refresh();
            setInterval(() => bell.refresh(), POLL_INTERVAL_MS);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();

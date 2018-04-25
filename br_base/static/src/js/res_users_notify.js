odoo.define('web_notify.WebClient', function (require) {
    "use strict";

    var base_bus = require('bus.bus');
    var core = require('web.core');
    var WebClient = require('web.WebClient');
    var session = require('web.session');

    var _t = core._t;

    WebClient.include({
        init: function (parent, client_options) {
            this._super(parent, client_options);
        },
        show_application: function () {
            this._super();
            this.start_polling();
        },
        on_logout: function () {
            var self = this;
            base_bus.bus.off('notification', this, this.bus_notification);
            this._super();
        },
        start_polling: function () {
            this.channel_warning = 'notify_warning_' + session.uid;
            this.channel_info = 'notify_info_' + session.uid;
            base_bus.bus.add_channel(this.channel_warning);
            base_bus.bus.add_channel(this.channel_info);
            base_bus.bus.on('notification', this, this.bus_notification);
            base_bus.bus.start_polling();
        },
        bus_notification: function (notifications) {
            var self = this;
            _.each(notifications, function (notification) {
                var channel = notification[0];
                var message = notification[1];
                if (channel === self.channel_warning) {
                    self.on_message_warning(message);
                } else if (channel == self.channel_info) {
                    self.on_message_info(message);
                }
            });
        },
        on_message_warning: function (message) {
            if (this.notification_manager) {
                this.notification_manager.do_warn(message.title, message.message, message.sticky);
            }
        },
        on_message_info: function (message) {
            if (this.notification_manager) {
                this.notification_manager.do_notify(message.title, message.message, message.sticky);
            }
        }
    });

});
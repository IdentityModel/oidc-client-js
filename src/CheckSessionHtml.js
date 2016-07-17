// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

export default html;

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Check Session IFrame</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>
<body>
    <iframe id="op"></iframe>
    <script>
        window.addEventListener("message", function (e) {
            var client_origin =  window.location.protocol + "//" + window.location.host;
            if (e.origin === client_origin) {
                var op_origin = data.op_origin;

                var session_state = data.session_state;
                var client_id = data.client_id;

                var op_iframe = document.getElementById("op");
                op_iframe.src = data.check_session_iframe;
                if (timer) {
                    window.clearInterval(timer);
                }
                var timer = window.setInterval(function () {
                    op_iframe.postMessage(client_id + " " + session_state, op_origin);
                }, data.check_interval || 2000);
            }
            else if (op_origin && e.origin === op_origin) {
                if (e.data === "changed" || e.data === "error") {
                    window.clearInterval(timer);
                    timer = null;
                    op_origin = null;
                }
                if (e.data === "changed") {
                    window.parent.postMessage("changed", client_origin);
                }
            }
        });
    </script>
</body>
</html>
`;
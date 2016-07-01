// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from "./Log";

export default class ErrorResponse extends Error {
    constructor({error = "", error_description = "", error_uri = "", state = ""} = {}
    ) {
        if (!error) {
            Log.error("No error passed to ErrorResponse");
            throw new Error("error");
        }

        super(error_description || error);

        this.name = "ErrorResponse";

        this._error = error;
        this._error_description = error_description;
        this._error_uri = error_uri;

        this._state = state;
    }

    _error;
    _error_description;
    _error_uri;
    _state;
}

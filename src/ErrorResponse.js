// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';

export class ErrorResponse extends Error {
    constructor({error, error_description, error_uri, state, session_state}={}
    ) {
         if (!error){
            Log.error("No error passed to ErrorResponse");
            throw new Error("error");
        }

        super(error_description || error);

        this.name = "ErrorResponse";

        this.error = error;
        this.error_description = error_description;
        this.error_uri = error_uri;

        this.state = state;
        this.session_state = session_state;
    }
}

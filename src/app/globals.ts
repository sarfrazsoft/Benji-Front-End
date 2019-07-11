'use strict';

import { environment } from './../environments/environment';

const backend = environment.host;
const web_protocol = environment.web_protocol;
const socket_protocl = environment.socket_protocl;

export const apiRoot = web_protocol + '://' + backend + '/api';
export const wsRoot = socket_protocl + '://' + backend;

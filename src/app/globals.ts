'use strict';

import { environment } from './../environments/environment';

const backend = environment.host;

export const apiRoot = 'http://' + backend + '/api';
export const wsRoot = 'ws://' + backend;

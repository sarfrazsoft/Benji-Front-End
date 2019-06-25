'use strict';

import { environment } from './../environments/environment';

const backend = environment.host;

export const apiRoot = 'http://' + backend + ':8080/api';
export const wsRoot = 'ws://' + backend + ':8080';

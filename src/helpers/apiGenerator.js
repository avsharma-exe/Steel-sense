import axios from 'axios';
import {api_secure_header} from "./paths/api_headers"
import React from 'react';

export const secureApi = axios.create({
  baseURL: api_secure_header,
  responseType: "json",
  headers: {
    // token: window.localStorage.getItem("accessToken") ? window.localStorage.getItem("accessToken") : null
  }
})



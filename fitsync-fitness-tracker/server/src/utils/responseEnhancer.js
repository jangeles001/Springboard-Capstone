import { response } from "express";

response.generateSuccessResponse = function (data, message = "Success!", status = 200) {
  return this.status(status).json({ message, data });
};

response.generateErrorResponse = function (message = "Server_Error", data = null, status = 500) {
  return this.status(status).json({ message, data });
};
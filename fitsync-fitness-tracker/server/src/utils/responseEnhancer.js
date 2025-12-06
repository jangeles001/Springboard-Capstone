import { response } from "express";

response.generateSuccessResponse = function (data, message = "Success!", status = 200) {
  return this.status(status).json({ message, data });
};

response.generateErrorResponse = function (message = "Server_Error", status = 500, data = null) {
  return this.status(status).json({ message, data });
};
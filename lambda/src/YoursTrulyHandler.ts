'use strict';

import Axios from 'axios';

import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';

export class YoursTrulyRequestHandler implements RequestHandler {
  public async canHandle(handlerInput: HandlerInput): Promise<boolean> {
    const targetHandlerName =
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
        ? (<IntentRequest>handlerInput.requestEnvelope.request).intent.name
        : handlerInput.requestEnvelope.request.type;

    return (
      targetHandlerName.startsWith('YoursTruly') ||
      targetHandlerName.endsWith('YesIntent') ||
      targetHandlerName.endsWith('NoIntent') ||
      targetHandlerName.endsWith('ResumeIntent')
    );
  }

  public handle(handlerInput: HandlerInput): Promise<Response> {
    return Axios({
      url: 'https://yours-truly.adtonos.com/webhook',
      method: 'POST',
      timeout: 5000,
      responseType: 'json',
      validateStatus: (_) => true,
      maxContentLength: 1024000,
      maxRedirects: 5,
      data: handlerInput.requestEnvelope,
    }).then((data: any) => {
      let response: Response = handlerInput.responseBuilder.getResponse();
      if (data.data && data.data.response) {
        response = <Response>data.data.response;
      }
      if (data.data && data.data.sessionAttributes) {
        const sessionAttributes = <Response>data.data.sessionAttributes;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      return response;
    });
  }
}

'use strict';

import { HandlerInput, ResponseFactory } from 'ask-sdk';
import { Response } from 'ask-sdk-model';

import { IHandler } from './utils/iHandler';
import { audioData } from './AudioAssets';
import { audio } from './AudioController';
import { i18n } from './utils/I18N';

export const IntentHandler: IHandler = {
  // launch request and play intent have the same handler
  LaunchRequest: async function (input: HandlerInput): Promise<Response> {
    return this['PlayAudio'](input);
  },
  PlayAudio: async function (input: HandlerInput): Promise<Response> {
    const request = input.requestEnvelope.request;

    // play the radio directly
    return Promise.resolve(
      audio.play(
        audioData(request).url,
        0,
        i18n.S(request, 'WELCOME_MSG', audioData(request).card.title),
        audioData(request).card
      )
    );
  },
  'AMAZON.HelpIntent': async function (input: HandlerInput): Promise<Response> {
    const request = input.requestEnvelope.request;
    return ResponseFactory.init()
      .speak(i18n.S(request, 'HELP_MSG', audioData(request).card.title))
      .withShouldEndSession(false)
      .getResponse();
  },
  SessionEndedRequest: async function (input: HandlerInput): Promise<Response> {
    // No session ended logic
    // do not return a response, as per https://developer.amazon.com/docs/custom-skills/handle-requests-sent-by-alexa.html#sessionendedrequest
    return Promise.resolve(input.responseBuilder.getResponse());
  },
  'System.ExceptionEncountered': async function (input: HandlerInput): Promise<Response> {
    console.log('\n******************* EXCEPTION **********************');
    console.log('\n' + JSON.stringify(input.requestEnvelope, null, 2));
    return Promise.resolve(input.responseBuilder.getResponse());
  },
  Unhandled: async function (input: HandlerInput): Promise<Response> {
    input.responseBuilder.speak(i18n.S(input.requestEnvelope.request, 'UNHANDLED_MSG'));
    return Promise.resolve(input.responseBuilder.withShouldEndSession(true).getResponse());
  },
  'AMAZON.NextIntent': async function (input: HandlerInput): Promise<Response> {
    input.responseBuilder.speak(i18n.S(input.requestEnvelope.request, 'CAN_NOT_SKIP_MSG'));
    return Promise.resolve(input.responseBuilder.withShouldEndSession(true).getResponse());
  },
  'AMAZON.PreviousIntent': async function (input: HandlerInput): Promise<Response> {
    input.responseBuilder.speak(i18n.S(input.requestEnvelope.request, 'CAN_NOT_SKIP_MSG'));
    return Promise.resolve(input.responseBuilder.withShouldEndSession(true).getResponse());
  },

  'AMAZON.PauseIntent': async function (input: HandlerInput): Promise<Response> {
    return this['AMAZON.StopIntent'](input);
  },
  'AMAZON.CancelIntent': async function (input: HandlerInput): Promise<Response> {
    return this['AMAZON.StopIntent'](input);
  },
  'AMAZON.StopIntent': async function (input: HandlerInput): Promise<Response> {
    return Promise.resolve(audio.stop(i18n.S(input.requestEnvelope.request, 'STOP_MSG')));
  },

  'AMAZON.ResumeIntent': async function (input: HandlerInput): Promise<Response> {
    const request = input.requestEnvelope.request;
    const msg = i18n.S(request, 'RESUME_MSG', audioData(request).card.title);
    return Promise.resolve(audio.play(audioData(request).url, 0, msg, audioData(request).card));
  },

  'AMAZON.LoopOnIntent': async function (input: HandlerInput): Promise<Response> {
    return this['AMAZON.StartOverIntent'](input);
  },
  'AMAZON.LoopOffIntent': async function (input: HandlerInput): Promise<Response> {
    return this['AMAZON.StartOverIntent'](input);
  },
  'AMAZON.ShuffleOnIntent': async function (input: HandlerInput): Promise<Response> {
    return this['AMAZON.StartOverIntent'](input);
  },
  'AMAZON.ShuffleOffIntent': async function (input: HandlerInput): Promise<Response> {
    return this['AMAZON.StartOverIntent'](input);
  },
  'AMAZON.StartOverIntent': async function (input: HandlerInput): Promise<Response> {
    input.responseBuilder.speak(i18n.S(input.requestEnvelope.request, 'NOT_POSSIBLE_MSG'));
    return Promise.resolve(input.responseBuilder.getResponse());
  },

  /*
   *  All Requests are received using a Remote Control.
   *  https://developer.amazon.com/docs/custom-skills/playback-controller-interface-reference.html#requests
   */
  'PlaybackController.PlayCommandIssued': async function (input: HandlerInput): Promise<Response> {
    const request = input.requestEnvelope.request;
    return Promise.resolve(audio.play(audioData(request).url, 0, null, null));
  },
  'PlaybackController.NextCommandIssued': async function (input: HandlerInput): Promise<Response> {
    return Promise.resolve(input.responseBuilder.getResponse());
  },
  'PlaybackController.PreviousCommandIssued': async function (input: HandlerInput): Promise<Response> {
    return Promise.resolve(input.responseBuilder.getResponse());
  },
  'PlaybackController.PauseCommandIssued': async function (input: HandlerInput): Promise<Response> {
    return Promise.resolve(audio.stop(null));
  },
};

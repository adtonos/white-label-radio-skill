'use strict';

import 'mocha';
import { expect } from 'chai';

import { interfaces, RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../src/index';
import { audioData } from '../src/AudioAssets';

import r from './request/play_intent.json'; // tslint:disable-line
const request: RequestEnvelope = <RequestEnvelope>r;

import { Assertion } from './utils/Assertion';
const A = new Assertion();

const USER_ID = 'amzn1.ask.account.123';
let skill_response: ResponseEnvelope;

describe('Audio Player Test : Play Intent with Jingle', function () {
  // pre-requisites
  before(() => {
    this.timeout(5000);
  });

  it('it responses with valid response structure ', () => {
    A.checkResponseStructure(skill_response);
  }),
    it('it responses with output speech ', () => {
      A.checkOutputSpeach(skill_response);
    }),
    it('it closes the session ', () => {
      A.checkSessionStatus(skill_response, true);
    }),
    it('it responses with AudioPlayer.Play directive ', () => {
      A.checkAudioPlayDirective(skill_response);
    });
});

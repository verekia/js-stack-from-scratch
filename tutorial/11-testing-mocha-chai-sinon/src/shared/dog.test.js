/* eslint-disable import/no-extraneous-dependencies, no-console */

import chai from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { describe, it } from 'mocha';
import Dog from './dog';

chai.should();
chai.use(sinonChai);

describe('Dog', () => {
  describe('barkInConsole', () => {
    it('should print a bark string with its name', () => {
      stub(console, 'log');
      new Dog('Test Toby').barkInConsole();
      console.log.should.have.been.calledWith('Wah wah, I am Test Toby');
      console.log.restore();
    });
  });
});

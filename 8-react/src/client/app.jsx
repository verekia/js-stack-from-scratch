import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Dog from '../shared/dog';

const dogBark = new Dog('Browser Toby').bark();

const App = props => (
  <div>
    The dog says: {props.dogBark}
  </div>
);

App.propTypes = {
  dogBark: PropTypes.string.isRequired,
};

ReactDOM.render(<App dogBark={dogBark} />, document.querySelector('.app'));

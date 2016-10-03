import React from 'react'

class Foo extends React.Component {
  render() {
    return (
      <div>Hello {this.props.name}!</div>
    );
  }
}

class Foo2 extends React.Component {
  render() {
    return (
      <div>Hello {this.props.name}!</div>
    );
  }
}

class Foo3 extends React.Component {
  render() {
    return <div />;
  }
}

class Bar extends React.Component {
  render() {
    const {
      name
    } = this.props;

    return (
      <div>Hello {name}!</div>
    );
  }
}

class Baz extends React.Component {
  props: { name: string };

  render() {
    return (
      <div>Hello {this.props.name}!</div>
    );
  }
}

class Qux extends React.Component {
  props: { name: string };

  render() {
    const {
      name
    } = this.props;

    return (
      <div>Hello {name}!</div>
    );
  }
}

function notOne() {
  return "Hello";
}

function AlsoNotOne(props) {
  return "Hello";
}

function NotAsMultipleParams(a, b) {
  return <div />;
}

function NotAsArrayPattern([]) {
  return <div />;
}

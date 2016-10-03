import React from 'react'

function Foo(props) {
  return (
    <div>Hello {props.name}!</div>
  );
}

function Foo2(notNamedProps) {
  return (
    <div>Hello {notNamedProps.name}!</div>
  );
}

function Foo3() {
  return <div />;
}

function Bar({ name }) {
  return (
    <div>Hello {name}!</div>
  );
}

function Baz(props: { name: string }) {
  return (
    <div>Hello {props.name}!</div>
  );
}

function Qux({ name }: { name: string }) {
  return (
    <div>Hello {name}!</div>
  );
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

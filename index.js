// const element = <h1 title="foo">Hello</h1>
// const element = React.createElement(
//   "h1",
//   { title: "foo" },
//   "Hello"
// )

// const element = {
//   type: "h1",
//   props: {
//     title: "foo",
//     children: "Hello"
//   }
// }
// const element = (
//   <div id="foo">
//     <a>bar</a>
//     <br />
//   </div>
// )
const Xact = {
  createElement,
  render
}



function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === "object" ? child : createTextElement(child))
    }
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render(element, container) {
  const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
  Object.keys(element.props).filter(key => key !== 'children').forEach(key => dom[key] = element.props[key])
  element.props.children.forEach(child => render(child, dom))
  container.appendChild(dom)
}

let nextUnitWork = null;
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitWork && !shouldYield) {
    nextUnitWork = performUnitOfWork(nextUnitWork)
    // requesttidlecallback也给了我们一个deadline参数。我们可以使用它来检查我们还有多少时间浏览器需要再次控制
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}


//  We use requestIdleCallback to make a loop.
// You can think of requestIdleCallback as a setTimeout,
// but instead of us telling it when to run,
// he browser will run the callback when the main thread is idle.

// React doesn’t use requestIdleCallback anymore.Now it uses the scheduler package.But for this use case it’s conceptually the same.
requestIdleCallback(workLoop)

function performUnitOfWork(nextUnitOfWork) {
  // TODO
}

const element = Xact.createElement(
  "div",
  { id: "foo" },
  Xact.createElement("a", {}, "bar"),
  Xact.createElement("br")
)
const container = document.getElementById("root")
Xact.render(element, container)
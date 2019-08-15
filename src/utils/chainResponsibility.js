class CHAIN {
  constructor(fn) {
    this.fn = fn
    this.successor = null
  }

  // 指定在链中的下一个节点
  setNextSuccessor(successor) {
    return this.successor = successor
  }

  // 传递请求给下个节点
  passRequest() {
    let ret = this.fn.apply(this, arguments)
    if (ret === 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments)
    }
    return ret
  }

  next() {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments)
  }
}

export default CHAIN
(function () {
  'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    define(Gp, "constructor", GeneratorFunctionPrototype);
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    });
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    define(Gp, iteratorSymbol, function() {
      return this;
    });

    define(Gp, "toString", function() {
      return "[object Generator]";
    });

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, in modern engines
    // we can explicitly access globalThis. In older engines we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }
  });

  (function () {
    var React = CrafterCMSNext.React;
    var ReactDOM = CrafterCMSNext.ReactDOM;
    var GOOGLE_API_PATH = '/studio/api/2/plugin/script/org/craftercms/plugin/youtube-picker/youtube/api.json';
    var API_KEY_EXISTS = '/studio/api/2/plugin/script/org/craftercms/plugin/youtube-picker/youtube/key_exists.json';

    function httpGet(_x) {
      return _httpGet.apply(this, arguments);
    }

    function _httpGet() {
      _httpGet = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(url) {
        var rxGet, rxMap, response, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                rxGet = CrafterCMSNext.util.ajax.get;
                rxMap = CrafterCMSNext.rxjs.operators.map;
                _context3.prev = 2;
                _context3.next = 5;
                return rxGet(url).pipe(rxMap(function (_ref8) {
                  var response = _ref8.response;
                  return response;
                })).toPromise();

              case 5:
                response = _context3.sent;
                result = response.result;
                return _context3.abrupt("return", result);

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](2);
                return _context3.abrupt("return", undefined);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[2, 10]]);
      }));
      return _httpGet.apply(this, arguments);
    }

    function searchYouTube(_x2, _x3) {
      return _searchYouTube.apply(this, arguments);
    }

    function _searchYouTube() {
      _searchYouTube = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(siteId, keyword) {
        var url, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = "".concat(location.origin).concat(GOOGLE_API_PATH, "?siteId=").concat(siteId, "&keyword=").concat(keyword);
                _context4.next = 3;
                return httpGet(url);

              case 3:
                result = _context4.sent;

                if (!(result && result.code === 200 && result.data)) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt("return", JSON.parse(result.data) || undefined);

              case 6:
                return _context4.abrupt("return", undefined);

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
      return _searchYouTube.apply(this, arguments);
    }

    function isConfiguredApiKey(_x4) {
      return _isConfiguredApiKey.apply(this, arguments);
    }

    function _isConfiguredApiKey() {
      _isConfiguredApiKey = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(siteId) {
        var url, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                url = "".concat(location.origin).concat(API_KEY_EXISTS, "?siteId=").concat(siteId);
                _context5.next = 3;
                return httpGet(url);

              case 3:
                result = _context5.sent;

                if (!(result && result.exists)) {
                  _context5.next = 6;
                  break;
                }

                return _context5.abrupt("return", true);

              case 6:
                return _context5.abrupt("return", false);

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));
      return _isConfiguredApiKey.apply(this, arguments);
    }

    function SearchBar(_ref) {
      var isDisable = _ref.isDisable,
          onSearchSubmit = _ref.onSearchSubmit;

      var _React$useState = React.useState(''),
          _React$useState2 = _slicedToArray(_React$useState, 2),
          keyword = _React$useState2[0],
          setKeyword = _React$useState2[1];

      var searchChange = function searchChange(e) {
        if (isDisable) return;
        setKeyword(e.target.value);
      };

      var submitSearch = function submitSearch(e) {
        if (isDisable) return;
        e.preventDefault();
        onSearchSubmit(keyword);
      };

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
        onSubmit: submitSearch,
        style: {
          marginTop: '20px'
        }
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        placeholder: "Search YouTube",
        className: "form-control",
        onChange: searchChange,
        disabled: isDisable
      })));
    }

    function VideoList(_ref2) {
      var videos = _ref2.videos,
          onVideoSelect = _ref2.onVideoSelect;
      var list = videos.map(function (video) {
        return /*#__PURE__*/React.createElement(VideoListItem, {
          onVideoSelect: onVideoSelect,
          key: video.etag,
          video: video
        });
      });
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", {
        className: "col-md-4 list-group",
        style: {
          marginTop: '20px'
        }
      }, list));
    }

    function VideoListItem(_ref3) {
      var video = _ref3.video,
          onVideoSelect = _ref3.onVideoSelect;
      var imgUrl = video.snippet.thumbnails["default"].url;
      return /*#__PURE__*/React.createElement("li", {
        className: "list-group-item",
        onClick: function onClick() {
          return onVideoSelect(video);
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "video-list-media"
      }, /*#__PURE__*/React.createElement("div", {
        className: "media-left"
      }, /*#__PURE__*/React.createElement("img", {
        className: "media-object",
        src: imgUrl
      })), /*#__PURE__*/React.createElement("div", {
        className: "media-body"
      }, /*#__PURE__*/React.createElement("div", {
        className: "media-heading"
      }, /*#__PURE__*/React.createElement("div", null, video.snippet.title)))));
    }

    function VideoDetail(_ref4) {
      var video = _ref4.video;

      if (!video) {
        return /*#__PURE__*/React.createElement("div", null);
      }

      var videoId = video.id.videoId;
      var url = "https://youtube.com/embed/".concat(videoId);
      return /*#__PURE__*/React.createElement("div", {
        className: "video-detail col-md-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: "embed-responsive embed-responsive-16by9",
        style: {
          marginTop: '20px'
        }
      }, /*#__PURE__*/React.createElement("iframe", {
        className: "embed-responsive-item",
        src: url
      })), /*#__PURE__*/React.createElement("div", {
        className: "details"
      }, /*#__PURE__*/React.createElement("div", null, video.snippet.title), /*#__PURE__*/React.createElement("div", null, video.snippet.description)));
    }

    function MyPicker(_ref5) {
      var siteId = _ref5.siteId,
          isViewMode = _ref5.isViewMode;

      var _React$useState3 = React.useState(null),
          _React$useState4 = _slicedToArray(_React$useState3, 2),
          selectedVideo = _React$useState4[0],
          setSelectedVideo = _React$useState4[1];

      var _React$useState5 = React.useState([]),
          _React$useState6 = _slicedToArray(_React$useState5, 2),
          videos = _React$useState6[0],
          setVideos = _React$useState6[1];

      var _React$useState7 = React.useState(false),
          _React$useState8 = _slicedToArray(_React$useState7, 2),
          noApiKey = _React$useState8[0],
          setNoApiKey = _React$useState8[1];

      var youtubeInputElmId = '#youtubeID_s input';
      var titleInputElmId = '#title_s input';
      var descriptionTextareaElmId = '#description_t textarea';
      var posterImageInputElmId = '#posterImage_s input';
      React.useEffect(function () {
        _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var setMetaAsDisabled, configured;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  setMetaAsDisabled = function setMetaAsDisabled(elementId) {
                    var timer = setInterval(function () {
                      if (typeof $ !== 'function') return;
                      var elm = $(elementId);
                      if (!elm) return;
                      elm.prop('disabled', true);
                      clearInterval(timer);
                    }, 100);
                  };

                  _context.next = 3;
                  return isConfiguredApiKey(siteId);

                case 3:
                  configured = _context.sent;

                  if (configured) {
                    setMetaAsDisabled(youtubeInputElmId);
                    setMetaAsDisabled(titleInputElmId);
                    setMetaAsDisabled(descriptionTextareaElmId);
                    setMetaAsDisabled(posterImageInputElmId);
                  } else {
                    setNoApiKey(true);
                  }

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))();
      }, []);

      var videoSearch = /*#__PURE__*/function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(siteId, keyword) {
          var res, video;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return searchYouTube(siteId, keyword);

                case 2:
                  res = _context2.sent;

                  if (res && res.items && res.items.length >= 0) {
                    setVideos(res.items);
                    setSelectedVideo(res.items[0]);
                    video = res.items[0];
                    updateInputs(video);
                  }

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function videoSearch(_x5, _x6) {
          return _ref7.apply(this, arguments);
        };
      }();

      var onSelectVideo = function onSelectVideo(video) {
        setSelectedVideo(video);
        updateInputs(video);
      };

      var updateInputs = function updateInputs(video) {
        if (typeof $ !== 'function') return;
        var $youtubeIdEl = $(youtubeInputElmId);
        var isIdElDisabled = Boolean($youtubeIdEl.attr('disabled'));
        var $titleEl = $(titleInputElmId);
        var isTitleElDisabled = Boolean($titleEl.attr('disabled'));
        var $descriptionEl = $(descriptionTextareaElmId);
        var isDescriptionElDisabled = Boolean($descriptionEl.attr('disabled'));
        var $posterImageEl = $(posterImageInputElmId);
        var isPosterImageElDisabled = Boolean($posterImageEl.attr('disabled'));
        isIdElDisabled && $youtubeIdEl.prop('disabled', false);
        isTitleElDisabled && $titleEl.prop('disabled', false);
        isDescriptionElDisabled && $descriptionEl.prop('disabled', false);
        isPosterImageElDisabled && $posterImageEl.prop('disabled', false);
        $youtubeIdEl.focus();
        $youtubeIdEl.val(video.id.videoId);
        $titleEl.focus();
        $titleEl.val(video.snippet.title);
        $descriptionEl.focus();
        $descriptionEl.val(video.snippet.description);
        $posterImageEl.focus();
        $posterImageEl.val(video.snippet.thumbnails.high.url);
        $posterImageEl.blur();
        isIdElDisabled && $youtubeIdEl.prop('disabled', true);
        isTitleElDisabled && $titleEl.prop('disabled', true);
        isDescriptionElDisabled && $descriptionEl.prop('disabled', true);
        isPosterImageElDisabled && $posterImageEl.prop('disabled', true);
      };

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "YouTube Picker"), /*#__PURE__*/React.createElement(SearchBar, {
        isDisable: isViewMode || noApiKey,
        onSearchSubmit: function onSearchSubmit(keyword) {
          return videoSearch(siteId, keyword);
        }
      }), noApiKey && /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'red'
        }
      }, "API key is not configured."), /*#__PURE__*/React.createElement(VideoDetail, {
        video: selectedVideo
      }), /*#__PURE__*/React.createElement(VideoList, {
        onVideoSelect: function onVideoSelect(selectedVideo) {
          return onSelectVideo(selectedVideo);
        },
        videos: videos
      }));
    }

    CStudioForms.Controls.Youtube = CStudioForms.Controls.Youtube || function (id, form, owner, properties, constraints) {
      this.owner = owner;
      this.owner.registerField(this);
      this.errors = [];
      this.properties = properties;
      this.constraints = constraints;
      this.inputEl = null;
      this.countEl = null;
      this.required = false;
      this.value = '_not-set';
      this.form = form;
      this.id = id;
      this.supportedPostFixes = ['_s'];

      if (properties) {
        var required = constraints.find(function (property) {
          return property.name === 'required';
        });

        if (required) {
          this.required = required.value === 'true';
        }
      }

      return this;
    };

    YAHOO.extend(CStudioForms.Controls.Youtube, CStudioForms.CStudioFormField, {
      getLabel: function getLabel() {
        return 'YouTube Picker';
      },
      render: function render(config, containerEl) {
        containerEl.id = this.id;
        var isViewMode = CStudioForms.engine.config.readonly;
        var siteId = CStudioAuthoringContext.site;
        ReactDOM.render(React.createElement(MyPicker, {
          siteId: siteId,
          isViewMode: isViewMode
        }), containerEl);
      },
      getValue: function getValue() {
        return this.value;
      },
      setValue: function setValue(value) {
        this.value = value;
      },
      getName: function getName() {
        return 'youtube';
      },
      getSupportedProperties: function getSupportedProperties() {
        return [];
      },
      getSupportedConstraints: function getSupportedConstraints() {
        return [];
      },
      getSupportedPostFixes: function getSupportedPostFixes() {
        return this.supportedPostFixes;
      }
    });
    CStudioAuthoring.Module.moduleLoaded('youtube', CStudioForms.Controls.Youtube);
  })();

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2pzL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCIuLi8uLi8uLi8uLi9zcmMvanMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBkZWZpbmUoSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIGRlZmluZShHcCwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gIGRlZmluZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvbik7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgZGVmaW5lKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlLCBhc3luY0l0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIGRlZmluZShHcCwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBkZWZpbmUoR3AsIFwidG9TdHJpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIGluIG1vZGVybiBlbmdpbmVzXG4gIC8vIHdlIGNhbiBleHBsaWNpdGx5IGFjY2VzcyBnbG9iYWxUaGlzLiBJbiBvbGRlciBlbmdpbmVzIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbFRoaXMucmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbiAgfSBlbHNlIHtcbiAgICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xuICB9XG59XG4iLCJpbXBvcnQgJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBSZWFjdCA9IENyYWZ0ZXJDTVNOZXh0LlJlYWN0O1xuICB2YXIgUmVhY3RET00gPSBDcmFmdGVyQ01TTmV4dC5SZWFjdERPTTtcbiAgY29uc3QgR09PR0xFX0FQSV9QQVRIID0gJy9zdHVkaW8vYXBpLzIvcGx1Z2luL3NjcmlwdC9vcmcvY3JhZnRlcmNtcy9wbHVnaW4veW91dHViZS1waWNrZXIveW91dHViZS9hcGkuanNvbic7XG4gIGNvbnN0IEFQSV9LRVlfRVhJU1RTID0gJy9zdHVkaW8vYXBpLzIvcGx1Z2luL3NjcmlwdC9vcmcvY3JhZnRlcmNtcy9wbHVnaW4veW91dHViZS1waWNrZXIveW91dHViZS9rZXlfZXhpc3RzLmpzb24nO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGh0dHBHZXQodXJsKSB7XG4gICAgY29uc3QgcnhHZXQgPSBDcmFmdGVyQ01TTmV4dC51dGlsLmFqYXguZ2V0O1xuICAgIGNvbnN0IHJ4TWFwID0gQ3JhZnRlckNNU05leHQucnhqcy5vcGVyYXRvcnMubWFwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJ4R2V0KHVybCkucGlwZShyeE1hcCgoeyByZXNwb25zZSB9KSA9PiByZXNwb25zZSkpLnRvUHJvbWlzZSgpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVzcG9uc2UucmVzdWx0O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBzZWFyY2hZb3VUdWJlKHNpdGVJZCwga2V5d29yZCkge1xuICAgIGNvbnN0IHVybCA9IGAke2xvY2F0aW9uLm9yaWdpbn0ke0dPT0dMRV9BUElfUEFUSH0/c2l0ZUlkPSR7c2l0ZUlkfSZrZXl3b3JkPSR7a2V5d29yZH1gO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGh0dHBHZXQodXJsKTtcbiAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5jb2RlID09PSAyMDAgJiYgcmVzdWx0LmRhdGEpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3VsdC5kYXRhKSB8fCB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGlzQ29uZmlndXJlZEFwaUtleShzaXRlSWQpIHtcbiAgICBjb25zdCB1cmwgPSBgJHtsb2NhdGlvbi5vcmlnaW59JHtBUElfS0VZX0VYSVNUU30/c2l0ZUlkPSR7c2l0ZUlkfWA7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaHR0cEdldCh1cmwpO1xuICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmV4aXN0cykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gU2VhcmNoQmFyKHsgaXNEaXNhYmxlLCBvblNlYXJjaFN1Ym1pdCB9KSB7XG4gICAgY29uc3QgW2tleXdvcmQsIHNldEtleXdvcmRdID0gUmVhY3QudXNlU3RhdGUoJycpO1xuXG4gICAgY29uc3Qgc2VhcmNoQ2hhbmdlID0gKGUpID0+IHtcbiAgICAgIGlmIChpc0Rpc2FibGUpIHJldHVybjtcblxuICAgICAgc2V0S2V5d29yZChlLnRhcmdldC52YWx1ZSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHN1Ym1pdFNlYXJjaCA9IChlKSA9PiB7XG4gICAgICBpZiAoaXNEaXNhYmxlKSByZXR1cm47XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9uU2VhcmNoU3VibWl0KGtleXdvcmQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17c3VibWl0U2VhcmNofSBzdHlsZT17e21hcmdpblRvcDonMjBweCd9fT5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIFlvdVR1YmVcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2VhcmNoQ2hhbmdlfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17aXNEaXNhYmxlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBWaWRlb0xpc3QoeyB2aWRlb3MsIG9uVmlkZW9TZWxlY3QgfSkge1xuICAgIGNvbnN0IGxpc3QgPSB2aWRlb3MubWFwKCh2aWRlbykgPT5cbiAgICAgIDxWaWRlb0xpc3RJdGVtXG4gICAgICAgIG9uVmlkZW9TZWxlY3Q9e29uVmlkZW9TZWxlY3R9XG4gICAgICAgIGtleT17dmlkZW8uZXRhZ31cbiAgICAgICAgdmlkZW89e3ZpZGVvfVxuICAgICAgLz5cbiAgICApO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwiY29sLW1kLTQgbGlzdC1ncm91cFwiIHN0eWxlPXt7bWFyZ2luVG9wOicyMHB4J319PlxuICAgICAgICAgIHtsaXN0fVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gVmlkZW9MaXN0SXRlbSh7IHZpZGVvLCBvblZpZGVvU2VsZWN0IH0pIHtcbiAgICBjb25zdCBpbWdVcmwgPSB2aWRlby5zbmlwcGV0LnRodW1ibmFpbHMuZGVmYXVsdC51cmw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaSBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW1cIiAgb25DbGljaz17KCkgPT4gb25WaWRlb1NlbGVjdCh2aWRlbyl9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInZpZGVvLWxpc3QtbWVkaWFcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWxlZnRcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwibWVkaWEtb2JqZWN0XCIgc3JjPXtpbWdVcmx9IC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWJvZHlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVkaWEtaGVhZGluZ1wiPlxuICAgICAgICAgICAgICA8ZGl2Pnt2aWRlby5zbmlwcGV0LnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBWaWRlb0RldGFpbCh7IHZpZGVvIH0pIHtcbiAgICBpZiAoIXZpZGVvKSB7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IHZpZGVvSWQgPSB2aWRlby5pZC52aWRlb0lkO1xuICAgIGNvbnN0IHVybCA9IGBodHRwczovL3lvdXR1YmUuY29tL2VtYmVkLyR7dmlkZW9JZH1gO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidmlkZW8tZGV0YWlsIGNvbC1tZC04XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZW1iZWQtcmVzcG9uc2l2ZSBlbWJlZC1yZXNwb25zaXZlLTE2Ynk5XCIgc3R5bGU9e3ttYXJnaW5Ub3A6JzIwcHgnfX0+XG4gICAgICAgICAgPGlmcmFtZSBjbGFzc05hbWU9XCJlbWJlZC1yZXNwb25zaXZlLWl0ZW1cIiBzcmM9e3VybH0+PC9pZnJhbWU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRldGFpbHNcIj5cbiAgICAgICAgICA8ZGl2Pnt2aWRlby5zbmlwcGV0LnRpdGxlfTwvZGl2PlxuICAgICAgICAgIDxkaXY+e3ZpZGVvLnNuaXBwZXQuZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gTXlQaWNrZXIoeyBzaXRlSWQsIGlzVmlld01vZGUgfSkge1xuICAgIGNvbnN0IFtzZWxlY3RlZFZpZGVvLCBzZXRTZWxlY3RlZFZpZGVvXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IFt2aWRlb3MsIHNldFZpZGVvc10gPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW25vQXBpS2V5LCBzZXROb0FwaUtleV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG5cbiAgICBjb25zdCB5b3V0dWJlSW5wdXRFbG1JZCA9ICcjeW91dHViZUlEX3MgaW5wdXQnO1xuICAgIGNvbnN0IHRpdGxlSW5wdXRFbG1JZCA9ICcjdGl0bGVfcyBpbnB1dCc7XG4gICAgY29uc3QgZGVzY3JpcHRpb25UZXh0YXJlYUVsbUlkID0gJyNkZXNjcmlwdGlvbl90IHRleHRhcmVhJztcbiAgICBjb25zdCBwb3N0ZXJJbWFnZUlucHV0RWxtSWQgPSAnI3Bvc3RlckltYWdlX3MgaW5wdXQnO1xuXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNldE1ldGFBc0Rpc2FibGVkID0gKGVsZW1lbnRJZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAkICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGVsbSA9ICQoZWxlbWVudElkKTtcbiAgICAgICAgICAgIGlmICghZWxtKSByZXR1cm47XG5cbiAgICAgICAgICAgIGVsbS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjb25maWd1cmVkID0gYXdhaXQgaXNDb25maWd1cmVkQXBpS2V5KHNpdGVJZCk7XG4gICAgICAgIGlmIChjb25maWd1cmVkKSB7XG4gICAgICAgICAgc2V0TWV0YUFzRGlzYWJsZWQoeW91dHViZUlucHV0RWxtSWQpO1xuICAgICAgICAgIHNldE1ldGFBc0Rpc2FibGVkKHRpdGxlSW5wdXRFbG1JZCk7XG4gICAgICAgICAgc2V0TWV0YUFzRGlzYWJsZWQoZGVzY3JpcHRpb25UZXh0YXJlYUVsbUlkKTtcbiAgICAgICAgICBzZXRNZXRhQXNEaXNhYmxlZChwb3N0ZXJJbWFnZUlucHV0RWxtSWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldE5vQXBpS2V5KHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KSgpO1xuICAgIH0sIFtdKTtcblxuICAgIGNvbnN0IHZpZGVvU2VhcmNoID0gYXN5bmMgKHNpdGVJZCwga2V5d29yZCkgPT4ge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgc2VhcmNoWW91VHViZShzaXRlSWQsIGtleXdvcmQpO1xuXG4gICAgICBpZiAocmVzICYmIHJlcy5pdGVtcyAmJiByZXMuaXRlbXMubGVuZ3RoID49IDApIHtcbiAgICAgICAgc2V0VmlkZW9zKHJlcy5pdGVtcyk7XG4gICAgICAgIHNldFNlbGVjdGVkVmlkZW8ocmVzLml0ZW1zWzBdKTtcbiAgICAgICAgY29uc3QgdmlkZW8gPSByZXMuaXRlbXNbMF07XG4gICAgICAgIHVwZGF0ZUlucHV0cyh2aWRlbyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG9uU2VsZWN0VmlkZW8gPSAodmlkZW8pID0+IHtcbiAgICAgIHNldFNlbGVjdGVkVmlkZW8odmlkZW8pO1xuICAgICAgdXBkYXRlSW5wdXRzKHZpZGVvKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlSW5wdXRzID0gKHZpZGVvKSA9PiB7XG4gICAgICBpZiAodHlwZW9mICQgIT09ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgICAgY29uc3QgJHlvdXR1YmVJZEVsID0gJCh5b3V0dWJlSW5wdXRFbG1JZCk7XG4gICAgICBjb25zdCBpc0lkRWxEaXNhYmxlZCA9IEJvb2xlYW4oJHlvdXR1YmVJZEVsLmF0dHIoJ2Rpc2FibGVkJykpO1xuICAgICAgY29uc3QgJHRpdGxlRWwgPSAkKHRpdGxlSW5wdXRFbG1JZCk7XG4gICAgICBjb25zdCBpc1RpdGxlRWxEaXNhYmxlZCA9IEJvb2xlYW4oJHRpdGxlRWwuYXR0cignZGlzYWJsZWQnKSk7XG4gICAgICBjb25zdCAkZGVzY3JpcHRpb25FbCA9ICQoZGVzY3JpcHRpb25UZXh0YXJlYUVsbUlkKTtcbiAgICAgIGNvbnN0IGlzRGVzY3JpcHRpb25FbERpc2FibGVkID0gQm9vbGVhbigkZGVzY3JpcHRpb25FbC5hdHRyKCdkaXNhYmxlZCcpKTtcbiAgICAgIGNvbnN0ICRwb3N0ZXJJbWFnZUVsID0gICQocG9zdGVySW1hZ2VJbnB1dEVsbUlkKTtcbiAgICAgIGNvbnN0IGlzUG9zdGVySW1hZ2VFbERpc2FibGVkID0gQm9vbGVhbigkcG9zdGVySW1hZ2VFbC5hdHRyKCdkaXNhYmxlZCcpKTtcblxuICAgICAgaXNJZEVsRGlzYWJsZWQgJiYgJHlvdXR1YmVJZEVsLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgaXNUaXRsZUVsRGlzYWJsZWQgJiYgJHRpdGxlRWwucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICBpc0Rlc2NyaXB0aW9uRWxEaXNhYmxlZCAmJiAkZGVzY3JpcHRpb25FbC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgIGlzUG9zdGVySW1hZ2VFbERpc2FibGVkICYmICRwb3N0ZXJJbWFnZUVsLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICAkeW91dHViZUlkRWwuZm9jdXMoKTtcbiAgICAgICR5b3V0dWJlSWRFbC52YWwodmlkZW8uaWQudmlkZW9JZCk7XG5cbiAgICAgICR0aXRsZUVsLmZvY3VzKCk7XG4gICAgICAkdGl0bGVFbC52YWwodmlkZW8uc25pcHBldC50aXRsZSk7XG5cbiAgICAgICRkZXNjcmlwdGlvbkVsLmZvY3VzKCk7XG4gICAgICAkZGVzY3JpcHRpb25FbC52YWwodmlkZW8uc25pcHBldC5kZXNjcmlwdGlvbik7XG5cbiAgICAgICRwb3N0ZXJJbWFnZUVsLmZvY3VzKCk7XG4gICAgICAkcG9zdGVySW1hZ2VFbC52YWwodmlkZW8uc25pcHBldC50aHVtYm5haWxzLmhpZ2gudXJsKTtcbiAgICAgICRwb3N0ZXJJbWFnZUVsLmJsdXIoKTtcblxuICAgICAgaXNJZEVsRGlzYWJsZWQgJiYgJHlvdXR1YmVJZEVsLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICBpc1RpdGxlRWxEaXNhYmxlZCAmJiAkdGl0bGVFbC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgaXNEZXNjcmlwdGlvbkVsRGlzYWJsZWQgJiYgJGRlc2NyaXB0aW9uRWwucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgIGlzUG9zdGVySW1hZ2VFbERpc2FibGVkICYmICRwb3N0ZXJJbWFnZUVsLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoND5Zb3VUdWJlIFBpY2tlcjwvaDQ+XG4gICAgICAgIDxTZWFyY2hCYXJcbiAgICAgICAgICBpc0Rpc2FibGU9e2lzVmlld01vZGUgfHwgbm9BcGlLZXl9XG4gICAgICAgICAgb25TZWFyY2hTdWJtaXQ9eyhrZXl3b3JkKSA9PiB2aWRlb1NlYXJjaChzaXRlSWQsIGtleXdvcmQpfVxuICAgICAgICAvPlxuICAgICAgICB7bm9BcGlLZXkgJiYgKFxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAncmVkJyB9fT5cbiAgICAgICAgICAgIEFQSSBrZXkgaXMgbm90IGNvbmZpZ3VyZWQuXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8VmlkZW9EZXRhaWwgdmlkZW89e3NlbGVjdGVkVmlkZW99Lz5cbiAgICAgICAgPFZpZGVvTGlzdFxuICAgICAgICAgIG9uVmlkZW9TZWxlY3Q9eyhzZWxlY3RlZFZpZGVvKSA9PiBvblNlbGVjdFZpZGVvKHNlbGVjdGVkVmlkZW8pfVxuICAgICAgICAgIHZpZGVvcz17dmlkZW9zfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIENTdHVkaW9Gb3Jtcy5Db250cm9scy5Zb3V0dWJlID1cbiAgQ1N0dWRpb0Zvcm1zLkNvbnRyb2xzLllvdXR1YmUgfHxcbiAgZnVuY3Rpb24oaWQsIGZvcm0sIG93bmVyLCBwcm9wZXJ0aWVzLCBjb25zdHJhaW50cykge1xuICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICB0aGlzLm93bmVyLnJlZ2lzdGVyRmllbGQodGhpcyk7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIHRoaXMuY29uc3RyYWludHMgPSBjb25zdHJhaW50cztcbiAgICB0aGlzLmlucHV0RWwgPSBudWxsO1xuICAgIHRoaXMuY291bnRFbCA9IG51bGw7XG4gICAgdGhpcy5yZXF1aXJlZCA9IGZhbHNlO1xuICAgIHRoaXMudmFsdWUgPSAnX25vdC1zZXQnO1xuICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuc3VwcG9ydGVkUG9zdEZpeGVzID0gWydfcyddO1xuXG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgIHZhciByZXF1aXJlZCA9IGNvbnN0cmFpbnRzLmZpbmQoZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5Lm5hbWUgPT09ICdyZXF1aXJlZCc7XG4gICAgICB9KTtcbiAgICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgICB0aGlzLnJlcXVpcmVkID0gcmVxdWlyZWQudmFsdWUgPT09ICd0cnVlJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBZQUhPTy5leHRlbmQoQ1N0dWRpb0Zvcm1zLkNvbnRyb2xzLllvdXR1YmUsIENTdHVkaW9Gb3Jtcy5DU3R1ZGlvRm9ybUZpZWxkLCB7XG4gICAgZ2V0TGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdZb3VUdWJlIFBpY2tlcic7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oY29uZmlnLCBjb250YWluZXJFbCkge1xuICAgICAgY29udGFpbmVyRWwuaWQgPSB0aGlzLmlkO1xuICAgICAgY29uc3QgaXNWaWV3TW9kZSA9IENTdHVkaW9Gb3Jtcy5lbmdpbmUuY29uZmlnLnJlYWRvbmx5O1xuXG4gICAgICBjb25zdCBzaXRlSWQgPSBDU3R1ZGlvQXV0aG9yaW5nQ29udGV4dC5zaXRlO1xuICAgICAgUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQaWNrZXIsIHsgc2l0ZUlkLCBpc1ZpZXdNb2RlIH0pLCBjb250YWluZXJFbCk7XG4gICAgfSxcblxuICAgIGdldFZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH0sXG5cbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgZ2V0TmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ3lvdXR1YmUnO1xuICAgIH0sXG5cbiAgICBnZXRTdXBwb3J0ZWRQcm9wZXJ0aWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuXG4gICAgZ2V0U3VwcG9ydGVkQ29uc3RyYWludHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG5cbiAgICBnZXRTdXBwb3J0ZWRQb3N0Rml4ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3VwcG9ydGVkUG9zdEZpeGVzO1xuICAgIH1cbiAgfSk7XG5cbiAgQ1N0dWRpb0F1dGhvcmluZy5Nb2R1bGUubW9kdWxlTG9hZGVkKCd5b3V0dWJlJywgQ1N0dWRpb0Zvcm1zLkNvbnRyb2xzLllvdXR1YmUpO1xufSkoKTtcbiJdLCJuYW1lcyI6WyJ1bmRlZmluZWQiLCJSZWFjdCIsIkNyYWZ0ZXJDTVNOZXh0IiwiUmVhY3RET00iLCJHT09HTEVfQVBJX1BBVEgiLCJBUElfS0VZX0VYSVNUUyIsImh0dHBHZXQiLCJ1cmwiLCJyeEdldCIsInV0aWwiLCJhamF4IiwiZ2V0IiwicnhNYXAiLCJyeGpzIiwib3BlcmF0b3JzIiwibWFwIiwicGlwZSIsInJlc3BvbnNlIiwidG9Qcm9taXNlIiwicmVzdWx0Iiwic2VhcmNoWW91VHViZSIsInNpdGVJZCIsImtleXdvcmQiLCJsb2NhdGlvbiIsIm9yaWdpbiIsImNvZGUiLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwiaXNDb25maWd1cmVkQXBpS2V5IiwiZXhpc3RzIiwiU2VhcmNoQmFyIiwiaXNEaXNhYmxlIiwib25TZWFyY2hTdWJtaXQiLCJ1c2VTdGF0ZSIsInNldEtleXdvcmQiLCJzZWFyY2hDaGFuZ2UiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJzdWJtaXRTZWFyY2giLCJwcmV2ZW50RGVmYXVsdCIsIm1hcmdpblRvcCIsIlZpZGVvTGlzdCIsInZpZGVvcyIsIm9uVmlkZW9TZWxlY3QiLCJsaXN0IiwidmlkZW8iLCJldGFnIiwiVmlkZW9MaXN0SXRlbSIsImltZ1VybCIsInNuaXBwZXQiLCJ0aHVtYm5haWxzIiwidGl0bGUiLCJWaWRlb0RldGFpbCIsInZpZGVvSWQiLCJpZCIsImRlc2NyaXB0aW9uIiwiTXlQaWNrZXIiLCJpc1ZpZXdNb2RlIiwic2VsZWN0ZWRWaWRlbyIsInNldFNlbGVjdGVkVmlkZW8iLCJzZXRWaWRlb3MiLCJub0FwaUtleSIsInNldE5vQXBpS2V5IiwieW91dHViZUlucHV0RWxtSWQiLCJ0aXRsZUlucHV0RWxtSWQiLCJkZXNjcmlwdGlvblRleHRhcmVhRWxtSWQiLCJwb3N0ZXJJbWFnZUlucHV0RWxtSWQiLCJ1c2VFZmZlY3QiLCJzZXRNZXRhQXNEaXNhYmxlZCIsImVsZW1lbnRJZCIsInRpbWVyIiwic2V0SW50ZXJ2YWwiLCIkIiwiZWxtIiwicHJvcCIsImNsZWFySW50ZXJ2YWwiLCJjb25maWd1cmVkIiwidmlkZW9TZWFyY2giLCJyZXMiLCJpdGVtcyIsImxlbmd0aCIsInVwZGF0ZUlucHV0cyIsIm9uU2VsZWN0VmlkZW8iLCIkeW91dHViZUlkRWwiLCJpc0lkRWxEaXNhYmxlZCIsIkJvb2xlYW4iLCJhdHRyIiwiJHRpdGxlRWwiLCJpc1RpdGxlRWxEaXNhYmxlZCIsIiRkZXNjcmlwdGlvbkVsIiwiaXNEZXNjcmlwdGlvbkVsRGlzYWJsZWQiLCIkcG9zdGVySW1hZ2VFbCIsImlzUG9zdGVySW1hZ2VFbERpc2FibGVkIiwiZm9jdXMiLCJ2YWwiLCJoaWdoIiwiYmx1ciIsImNvbG9yIiwiQ1N0dWRpb0Zvcm1zIiwiQ29udHJvbHMiLCJZb3V0dWJlIiwiZm9ybSIsIm93bmVyIiwicHJvcGVydGllcyIsImNvbnN0cmFpbnRzIiwicmVnaXN0ZXJGaWVsZCIsImVycm9ycyIsImlucHV0RWwiLCJjb3VudEVsIiwicmVxdWlyZWQiLCJzdXBwb3J0ZWRQb3N0Rml4ZXMiLCJmaW5kIiwicHJvcGVydHkiLCJuYW1lIiwiWUFIT08iLCJleHRlbmQiLCJDU3R1ZGlvRm9ybUZpZWxkIiwiZ2V0TGFiZWwiLCJyZW5kZXIiLCJjb25maWciLCJjb250YWluZXJFbCIsImVuZ2luZSIsInJlYWRvbmx5IiwiQ1N0dWRpb0F1dGhvcmluZ0NvbnRleHQiLCJzaXRlIiwiY3JlYXRlRWxlbWVudCIsImdldFZhbHVlIiwic2V0VmFsdWUiLCJnZXROYW1lIiwiZ2V0U3VwcG9ydGVkUHJvcGVydGllcyIsImdldFN1cHBvcnRlZENvbnN0cmFpbnRzIiwiZ2V0U3VwcG9ydGVkUG9zdEZpeGVzIiwiQ1N0dWRpb0F1dGhvcmluZyIsIk1vZHVsZSIsIm1vZHVsZUxvYWRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxPQUFPLElBQUksVUFBVSxPQUFPLEVBQUU7QUFFbEM7RUFDQSxF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

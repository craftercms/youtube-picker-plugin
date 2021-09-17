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

    function searchYouTube(_x, _x2) {
      return _searchYouTube.apply(this, arguments);
    }

    function _searchYouTube() {
      _searchYouTube = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(keyword, googleApiKey) {
        var url, response, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&q=".concat(keyword, "&key=").concat(googleApiKey);
                _context2.prev = 1;
                _context2.next = 4;
                return fetch(url);

              case 4:
                response = _context2.sent;
                _context2.next = 7;
                return response.json();

              case 7:
                data = _context2.sent;
                return _context2.abrupt("return", data || undefined);

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](1);
                return _context2.abrupt("return", undefined);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 11]]);
      }));
      return _searchYouTube.apply(this, arguments);
    }

    function NoApiKeySet() {
      return /*#__PURE__*/React.createElement("div", {
        className: "alert alert-warning"
      }, /*#__PURE__*/React.createElement("span", {
        className: "fa fa-exclamation-triangle",
        style: {
          marginRight: '5px'
        }
      }, "The Google API Key has not been set."));
    }

    function SearchBar(_ref) {
      var onSearchSubmit = _ref.onSearchSubmit;

      var _React$useState = React.useState(''),
          _React$useState2 = _slicedToArray(_React$useState, 2),
          keyword = _React$useState2[0],
          setKeyword = _React$useState2[1];

      var searchChange = function searchChange(e) {
        setKeyword(e.target.value);
      };

      var submitSearch = function submitSearch(e) {
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
        onChange: searchChange
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
      var googleApiKey = _ref5.googleApiKey;

      var _React$useState3 = React.useState(null),
          _React$useState4 = _slicedToArray(_React$useState3, 2),
          selectedVideo = _React$useState4[0],
          setSelectedVideo = _React$useState4[1];

      var _React$useState5 = React.useState([]),
          _React$useState6 = _slicedToArray(_React$useState5, 2),
          videos = _React$useState6[0],
          setVideos = _React$useState6[1];

      var videoSearch = /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(keyword) {
          var res, video;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return searchYouTube(keyword, googleApiKey);

                case 2:
                  res = _context.sent;

                  if (res && res.items && res.items.length >= 0) {
                    setVideos(res.items);
                    setSelectedVideo(res.items[0]);
                    video = res.items[0];
                    updateInputs(video);
                  }

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function videoSearch(_x3) {
          return _ref6.apply(this, arguments);
        };
      }();

      var onSelectVideo = function onSelectVideo(video) {
        setSelectedVideo(video);
        updateInputs(video);
      };

      var updateInputs = function updateInputs(video) {
        if (typeof $ !== 'function') return;
        var $youtubeIdEl = $('#youtubeID_s input');
        var isIdElDisabled = Boolean($youtubeIdEl.attr('disabled'));
        var $titleEl = $('#title_s input');
        var isTitleElDisabled = Boolean($titleEl.attr('disabled'));
        var $descriptionEl = $('#description_t textarea');
        var isDescriptionElDisabled = Boolean($descriptionEl.attr('disabled'));
        var $posterImageEl = $('#posterImage_s input');
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

      if (googleApiKey !== '') {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "YouTube Picker"), /*#__PURE__*/React.createElement(SearchBar, {
          onSearchSubmit: function onSearchSubmit(keyword) {
            return videoSearch(keyword);
          }
        }), /*#__PURE__*/React.createElement(VideoDetail, {
          video: selectedVideo
        }), /*#__PURE__*/React.createElement(VideoList, {
          onVideoSelect: function onVideoSelect(selectedVideo) {
            return onSelectVideo(selectedVideo);
          },
          videos: videos
        }));
      } else {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "YouTube Picker"), /*#__PURE__*/React.createElement(NoApiKeySet, null));
      }
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

        var googleapi_key = properties.find(function (property) {
          return property.name === 'googleapi_key';
        });

        if (googleapi_key) {
          this.googleapi_key = googleapi_key.value;
        }
      }

      return this;
    };

    YAHOO.extend(CStudioForms.Controls.Youtube, CStudioForms.CStudioFormField, {
      getLabel: function getLabel() {
        return 'YouTube Picker';
      },
      render: function render(config, containerEl) {
        // we need to make the general layout of a control inherit from common
        // you should be able to override it -- but most of the time it wil be the same
        containerEl.id = this.id;
        var googleApiKey = this.googleapi_key;
        ReactDOM.render( /*#__PURE__*/React.createElement(MyPicker, {
          googleApiKey: googleApiKey
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
        return [{
          label: 'Google API Key',
          name: 'googleapi_key',
          type: 'string',
          defaultValue: ''
        }];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2pzL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCIuLi8uLi8uLi8uLi9zcmMvanMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBkZWZpbmUoSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIGRlZmluZShHcCwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gIGRlZmluZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvbik7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgZGVmaW5lKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlLCBhc3luY0l0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIGRlZmluZShHcCwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBkZWZpbmUoR3AsIFwidG9TdHJpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIGluIG1vZGVybiBlbmdpbmVzXG4gIC8vIHdlIGNhbiBleHBsaWNpdGx5IGFjY2VzcyBnbG9iYWxUaGlzLiBJbiBvbGRlciBlbmdpbmVzIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbFRoaXMucmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbiAgfSBlbHNlIHtcbiAgICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xuICB9XG59XG4iLCJpbXBvcnQgJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBSZWFjdCA9IENyYWZ0ZXJDTVNOZXh0LlJlYWN0O1xuICB2YXIgUmVhY3RET00gPSBDcmFmdGVyQ01TTmV4dC5SZWFjdERPTTtcblxuICBhc3luYyBmdW5jdGlvbiBzZWFyY2hZb3VUdWJlKGtleXdvcmQsIGdvb2dsZUFwaUtleSkge1xuICAgIGNvbnN0IHVybCA9IGBodHRwczovL3lvdXR1YmUuZ29vZ2xlYXBpcy5jb20veW91dHViZS92My9zZWFyY2g/cGFydD1zbmlwcGV0JnR5cGU9dmlkZW8mcT0ke2tleXdvcmR9JmtleT0ke2dvb2dsZUFwaUtleX1gXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICByZXR1cm4gZGF0YSB8fCB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gTm9BcGlLZXlTZXQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtd2FybmluZ1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1leGNsYW1hdGlvbi10cmlhbmdsZVwiIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiAnNXB4JyB9fT5cbiAgICAgICAgICBUaGUgR29vZ2xlIEFQSSBLZXkgaGFzIG5vdCBiZWVuIHNldC5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFNlYXJjaEJhcih7IG9uU2VhcmNoU3VibWl0IH0pIHtcbiAgICBjb25zdCBba2V5d29yZCwgc2V0S2V5d29yZF0gPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG5cbiAgICBjb25zdCBzZWFyY2hDaGFuZ2UgPSAoZSkgPT4ge1xuICAgICAgc2V0S2V5d29yZChlLnRhcmdldC52YWx1ZSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHN1Ym1pdFNlYXJjaCA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBvblNlYXJjaFN1Ym1pdChrZXl3b3JkKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3N1Ym1pdFNlYXJjaH0gc3R5bGU9e3ttYXJnaW5Ub3A6JzIwcHgnfX0+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBZb3VUdWJlXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NlYXJjaENoYW5nZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gVmlkZW9MaXN0KHsgdmlkZW9zLCBvblZpZGVvU2VsZWN0IH0pIHtcbiAgICBjb25zdCBsaXN0ID0gdmlkZW9zLm1hcCgodmlkZW8pID0+XG4gICAgICA8VmlkZW9MaXN0SXRlbVxuICAgICAgICBvblZpZGVvU2VsZWN0PXtvblZpZGVvU2VsZWN0fVxuICAgICAgICBrZXk9e3ZpZGVvLmV0YWd9XG4gICAgICAgIHZpZGVvPXt2aWRlb31cbiAgICAgIC8+XG4gICAgKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImNvbC1tZC00IGxpc3QtZ3JvdXBcIiBzdHlsZT17e21hcmdpblRvcDonMjBweCd9fT5cbiAgICAgICAgICB7bGlzdH1cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIFZpZGVvTGlzdEl0ZW0oeyB2aWRlbywgb25WaWRlb1NlbGVjdCB9KSB7XG4gICAgY29uc3QgaW1nVXJsID0gdmlkZW8uc25pcHBldC50aHVtYm5haWxzLmRlZmF1bHQudXJsO1xuICAgIHJldHVybiAoXG4gICAgICA8bGkgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtXCIgIG9uQ2xpY2s9eygpID0+IG9uVmlkZW9TZWxlY3QodmlkZW8pfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aWRlby1saXN0LW1lZGlhXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cIm1lZGlhLW9iamVjdFwiIHNyYz17aW1nVXJsfSAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWhlYWRpbmdcIj5cbiAgICAgICAgICAgICAgPGRpdj57dmlkZW8uc25pcHBldC50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gVmlkZW9EZXRhaWwoeyB2aWRlbyB9KSB7XG4gICAgaWYgKCF2aWRlbykge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCB2aWRlb0lkID0gdmlkZW8uaWQudmlkZW9JZDtcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly95b3V0dWJlLmNvbS9lbWJlZC8ke3ZpZGVvSWR9YDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInZpZGVvLWRldGFpbCBjb2wtbWQtOFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVtYmVkLXJlc3BvbnNpdmUgZW1iZWQtcmVzcG9uc2l2ZS0xNmJ5OVwiIHN0eWxlPXt7bWFyZ2luVG9wOicyMHB4J319PlxuICAgICAgICAgIDxpZnJhbWUgY2xhc3NOYW1lPVwiZW1iZWQtcmVzcG9uc2l2ZS1pdGVtXCIgc3JjPXt1cmx9PjwvaWZyYW1lPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXRhaWxzXCI+XG4gICAgICAgICAgPGRpdj57dmlkZW8uc25pcHBldC50aXRsZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2Pnt2aWRlby5zbmlwcGV0LmRlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIE15UGlja2VyKHsgZ29vZ2xlQXBpS2V5IH0pIHtcbiAgICBjb25zdCBbc2VsZWN0ZWRWaWRlbywgc2V0U2VsZWN0ZWRWaWRlb10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbdmlkZW9zLCBzZXRWaWRlb3NdID0gUmVhY3QudXNlU3RhdGUoW10pO1xuXG4gICAgY29uc3QgdmlkZW9TZWFyY2ggPSBhc3luYyAoa2V5d29yZCkgPT4ge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgc2VhcmNoWW91VHViZShrZXl3b3JkLCBnb29nbGVBcGlLZXkpO1xuXG4gICAgICBpZiAocmVzICYmIHJlcy5pdGVtcyAmJiByZXMuaXRlbXMubGVuZ3RoID49IDApIHtcbiAgICAgICAgc2V0VmlkZW9zKHJlcy5pdGVtcyk7XG4gICAgICAgIHNldFNlbGVjdGVkVmlkZW8ocmVzLml0ZW1zWzBdKTtcbiAgICAgICAgY29uc3QgdmlkZW8gPSByZXMuaXRlbXNbMF07XG4gICAgICAgIHVwZGF0ZUlucHV0cyh2aWRlbyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG9uU2VsZWN0VmlkZW8gPSAodmlkZW8pID0+IHtcbiAgICAgIHNldFNlbGVjdGVkVmlkZW8odmlkZW8pO1xuICAgICAgdXBkYXRlSW5wdXRzKHZpZGVvKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlSW5wdXRzID0gKHZpZGVvKSA9PiB7XG4gICAgICBpZiAodHlwZW9mICQgIT09ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgICAgY29uc3QgJHlvdXR1YmVJZEVsID0gJCgnI3lvdXR1YmVJRF9zIGlucHV0Jyk7XG4gICAgICBjb25zdCBpc0lkRWxEaXNhYmxlZCA9IEJvb2xlYW4oJHlvdXR1YmVJZEVsLmF0dHIoJ2Rpc2FibGVkJykpO1xuICAgICAgY29uc3QgJHRpdGxlRWwgPSAkKCcjdGl0bGVfcyBpbnB1dCcpO1xuICAgICAgY29uc3QgaXNUaXRsZUVsRGlzYWJsZWQgPSBCb29sZWFuKCR0aXRsZUVsLmF0dHIoJ2Rpc2FibGVkJykpO1xuICAgICAgY29uc3QgJGRlc2NyaXB0aW9uRWwgPSAkKCcjZGVzY3JpcHRpb25fdCB0ZXh0YXJlYScpO1xuICAgICAgY29uc3QgaXNEZXNjcmlwdGlvbkVsRGlzYWJsZWQgPSBCb29sZWFuKCRkZXNjcmlwdGlvbkVsLmF0dHIoJ2Rpc2FibGVkJykpO1xuICAgICAgY29uc3QgJHBvc3RlckltYWdlRWwgPSAgJCgnI3Bvc3RlckltYWdlX3MgaW5wdXQnKTtcbiAgICAgIGNvbnN0IGlzUG9zdGVySW1hZ2VFbERpc2FibGVkID0gQm9vbGVhbigkcG9zdGVySW1hZ2VFbC5hdHRyKCdkaXNhYmxlZCcpKTtcblxuICAgICAgaXNJZEVsRGlzYWJsZWQgJiYgJHlvdXR1YmVJZEVsLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgaXNUaXRsZUVsRGlzYWJsZWQgJiYgJHRpdGxlRWwucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICBpc0Rlc2NyaXB0aW9uRWxEaXNhYmxlZCAmJiAkZGVzY3JpcHRpb25FbC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgIGlzUG9zdGVySW1hZ2VFbERpc2FibGVkICYmICRwb3N0ZXJJbWFnZUVsLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICAkeW91dHViZUlkRWwuZm9jdXMoKTtcbiAgICAgICR5b3V0dWJlSWRFbC52YWwodmlkZW8uaWQudmlkZW9JZCk7XG5cbiAgICAgICR0aXRsZUVsLmZvY3VzKCk7XG4gICAgICAkdGl0bGVFbC52YWwodmlkZW8uc25pcHBldC50aXRsZSk7XG5cbiAgICAgICRkZXNjcmlwdGlvbkVsLmZvY3VzKCk7XG4gICAgICAkZGVzY3JpcHRpb25FbC52YWwodmlkZW8uc25pcHBldC5kZXNjcmlwdGlvbik7XG5cbiAgICAgICRwb3N0ZXJJbWFnZUVsLmZvY3VzKCk7XG4gICAgICAkcG9zdGVySW1hZ2VFbC52YWwodmlkZW8uc25pcHBldC50aHVtYm5haWxzLmhpZ2gudXJsKTtcbiAgICAgICRwb3N0ZXJJbWFnZUVsLmJsdXIoKTtcblxuICAgICAgaXNJZEVsRGlzYWJsZWQgJiYgJHlvdXR1YmVJZEVsLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICBpc1RpdGxlRWxEaXNhYmxlZCAmJiAkdGl0bGVFbC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgaXNEZXNjcmlwdGlvbkVsRGlzYWJsZWQgJiYgJGRlc2NyaXB0aW9uRWwucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgIGlzUG9zdGVySW1hZ2VFbERpc2FibGVkICYmICRwb3N0ZXJJbWFnZUVsLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGdvb2dsZUFwaUtleSAhPT0gJycpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGg0PllvdVR1YmUgUGlja2VyPC9oND5cbiAgICAgICAgICA8U2VhcmNoQmFyIG9uU2VhcmNoU3VibWl0PXsoa2V5d29yZCkgPT4gdmlkZW9TZWFyY2goa2V5d29yZCl9IC8+XG4gICAgICAgICAgPFZpZGVvRGV0YWlsIHZpZGVvPXtzZWxlY3RlZFZpZGVvfS8+XG4gICAgICAgICAgPFZpZGVvTGlzdFxuICAgICAgICAgICAgb25WaWRlb1NlbGVjdD17KHNlbGVjdGVkVmlkZW8pID0+IG9uU2VsZWN0VmlkZW8oc2VsZWN0ZWRWaWRlbyl9XG4gICAgICAgICAgICB2aWRlb3M9e3ZpZGVvc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGg0PllvdVR1YmUgUGlja2VyPC9oND5cbiAgICAgICAgICA8Tm9BcGlLZXlTZXQgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgQ1N0dWRpb0Zvcm1zLkNvbnRyb2xzLllvdXR1YmUgPVxuICBDU3R1ZGlvRm9ybXMuQ29udHJvbHMuWW91dHViZSB8fFxuICBmdW5jdGlvbihpZCwgZm9ybSwgb3duZXIsIHByb3BlcnRpZXMsIGNvbnN0cmFpbnRzKSB7XG4gICAgdGhpcy5vd25lciA9IG93bmVyO1xuICAgIHRoaXMub3duZXIucmVnaXN0ZXJGaWVsZCh0aGlzKTtcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgdGhpcy5jb25zdHJhaW50cyA9IGNvbnN0cmFpbnRzO1xuICAgIHRoaXMuaW5wdXRFbCA9IG51bGw7XG4gICAgdGhpcy5jb3VudEVsID0gbnVsbDtcbiAgICB0aGlzLnJlcXVpcmVkID0gZmFsc2U7XG4gICAgdGhpcy52YWx1ZSA9ICdfbm90LXNldCc7XG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5zdXBwb3J0ZWRQb3N0Rml4ZXMgPSBbJ19zJ107XG5cbiAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgdmFyIHJlcXVpcmVkID0gY29uc3RyYWludHMuZmluZChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gcHJvcGVydHkubmFtZSA9PT0gJ3JlcXVpcmVkJztcbiAgICAgIH0pO1xuICAgICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICAgIHRoaXMucmVxdWlyZWQgPSByZXF1aXJlZC52YWx1ZSA9PT0gJ3RydWUnO1xuICAgICAgfVxuICAgICAgdmFyIGdvb2dsZWFwaV9rZXkgPSBwcm9wZXJ0aWVzLmZpbmQoZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5Lm5hbWUgPT09ICdnb29nbGVhcGlfa2V5JztcbiAgICAgIH0pO1xuICAgICAgaWYgKGdvb2dsZWFwaV9rZXkpIHtcbiAgICAgICAgdGhpcy5nb29nbGVhcGlfa2V5ID0gZ29vZ2xlYXBpX2tleS52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBZQUhPTy5leHRlbmQoQ1N0dWRpb0Zvcm1zLkNvbnRyb2xzLllvdXR1YmUsIENTdHVkaW9Gb3Jtcy5DU3R1ZGlvRm9ybUZpZWxkLCB7XG4gICAgZ2V0TGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdZb3VUdWJlIFBpY2tlcic7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oY29uZmlnLCBjb250YWluZXJFbCkge1xuICAgICAgLy8gd2UgbmVlZCB0byBtYWtlIHRoZSBnZW5lcmFsIGxheW91dCBvZiBhIGNvbnRyb2wgaW5oZXJpdCBmcm9tIGNvbW1vblxuICAgICAgLy8geW91IHNob3VsZCBiZSBhYmxlIHRvIG92ZXJyaWRlIGl0IC0tIGJ1dCBtb3N0IG9mIHRoZSB0aW1lIGl0IHdpbCBiZSB0aGUgc2FtZVxuICAgICAgY29udGFpbmVyRWwuaWQgPSB0aGlzLmlkO1xuICAgICAgdmFyIGdvb2dsZUFwaUtleSA9IHRoaXMuZ29vZ2xlYXBpX2tleTtcblxuICAgICAgUmVhY3RET00ucmVuZGVyKCAvKiNfX1BVUkVfXyovUmVhY3QuY3JlYXRlRWxlbWVudChNeVBpY2tlciwgeyBnb29nbGVBcGlLZXkgfSksIGNvbnRhaW5lckVsKTtcbiAgICB9LFxuXG4gICAgZ2V0VmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgfSxcblxuICAgIHNldFZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICBnZXROYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAneW91dHViZSc7XG4gICAgfSxcblxuICAgIGdldFN1cHBvcnRlZFByb3BlcnRpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFt7IGxhYmVsOiAnR29vZ2xlIEFQSSBLZXknLCBuYW1lOiAnZ29vZ2xlYXBpX2tleScsIHR5cGU6ICdzdHJpbmcnLCBkZWZhdWx0VmFsdWU6ICcnIH1dO1xuICAgIH0sXG5cbiAgICBnZXRTdXBwb3J0ZWRDb25zdHJhaW50czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSxcblxuICAgIGdldFN1cHBvcnRlZFBvc3RGaXhlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdXBwb3J0ZWRQb3N0Rml4ZXM7XG4gICAgfVxuICB9KTtcblxuICBDU3R1ZGlvQXV0aG9yaW5nLk1vZHVsZS5tb2R1bGVMb2FkZWQoJ3lvdXR1YmUnLCBDU3R1ZGlvRm9ybXMuQ29udHJvbHMuWW91dHViZSk7XG59KSgpO1xuIl0sIm5hbWVzIjpbInVuZGVmaW5lZCIsIlJlYWN0IiwiQ3JhZnRlckNNU05leHQiLCJSZWFjdERPTSIsInNlYXJjaFlvdVR1YmUiLCJrZXl3b3JkIiwiZ29vZ2xlQXBpS2V5IiwidXJsIiwiZmV0Y2giLCJyZXNwb25zZSIsImpzb24iLCJkYXRhIiwiTm9BcGlLZXlTZXQiLCJtYXJnaW5SaWdodCIsIlNlYXJjaEJhciIsIm9uU2VhcmNoU3VibWl0IiwidXNlU3RhdGUiLCJzZXRLZXl3b3JkIiwic2VhcmNoQ2hhbmdlIiwiZSIsInRhcmdldCIsInZhbHVlIiwic3VibWl0U2VhcmNoIiwicHJldmVudERlZmF1bHQiLCJtYXJnaW5Ub3AiLCJWaWRlb0xpc3QiLCJ2aWRlb3MiLCJvblZpZGVvU2VsZWN0IiwibGlzdCIsIm1hcCIsInZpZGVvIiwiZXRhZyIsIlZpZGVvTGlzdEl0ZW0iLCJpbWdVcmwiLCJzbmlwcGV0IiwidGh1bWJuYWlscyIsInRpdGxlIiwiVmlkZW9EZXRhaWwiLCJ2aWRlb0lkIiwiaWQiLCJkZXNjcmlwdGlvbiIsIk15UGlja2VyIiwic2VsZWN0ZWRWaWRlbyIsInNldFNlbGVjdGVkVmlkZW8iLCJzZXRWaWRlb3MiLCJ2aWRlb1NlYXJjaCIsInJlcyIsIml0ZW1zIiwibGVuZ3RoIiwidXBkYXRlSW5wdXRzIiwib25TZWxlY3RWaWRlbyIsIiQiLCIkeW91dHViZUlkRWwiLCJpc0lkRWxEaXNhYmxlZCIsIkJvb2xlYW4iLCJhdHRyIiwiJHRpdGxlRWwiLCJpc1RpdGxlRWxEaXNhYmxlZCIsIiRkZXNjcmlwdGlvbkVsIiwiaXNEZXNjcmlwdGlvbkVsRGlzYWJsZWQiLCIkcG9zdGVySW1hZ2VFbCIsImlzUG9zdGVySW1hZ2VFbERpc2FibGVkIiwicHJvcCIsImZvY3VzIiwidmFsIiwiaGlnaCIsImJsdXIiLCJDU3R1ZGlvRm9ybXMiLCJDb250cm9scyIsIllvdXR1YmUiLCJmb3JtIiwib3duZXIiLCJwcm9wZXJ0aWVzIiwiY29uc3RyYWludHMiLCJyZWdpc3RlckZpZWxkIiwiZXJyb3JzIiwiaW5wdXRFbCIsImNvdW50RWwiLCJyZXF1aXJlZCIsInN1cHBvcnRlZFBvc3RGaXhlcyIsImZpbmQiLCJwcm9wZXJ0eSIsIm5hbWUiLCJnb29nbGVhcGlfa2V5IiwiWUFIT08iLCJleHRlbmQiLCJDU3R1ZGlvRm9ybUZpZWxkIiwiZ2V0TGFiZWwiLCJyZW5kZXIiLCJjb25maWciLCJjb250YWluZXJFbCIsImNyZWF0ZUVsZW1lbnQiLCJnZXRWYWx1ZSIsInNldFZhbHVlIiwiZ2V0TmFtZSIsImdldFN1cHBvcnRlZFByb3BlcnRpZXMiLCJsYWJlbCIsInR5cGUiLCJkZWZhdWx0VmFsdWUiLCJnZXRTdXBwb3J0ZWRDb25zdHJhaW50cyIsImdldFN1cHBvcnRlZFBvc3RGaXhlcyIsIkNTdHVkaW9BdXRob3JpbmciLCJNb2R1bGUiLCJtb2R1bGVMb2FkZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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

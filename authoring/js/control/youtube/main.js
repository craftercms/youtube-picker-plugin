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

    function searchYouTube(_x, _x2) {
      return _searchYouTube.apply(this, arguments);
    }

    function _searchYouTube() {
      _searchYouTube = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(siteId, keyword) {
        var url, rxGet, rxMap, response, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = "".concat(location.origin).concat(GOOGLE_API_PATH, "?siteId=").concat(siteId, "&keyword=").concat(keyword);
                _context2.prev = 1;
                rxGet = CrafterCMSNext.util.ajax.get;
                rxMap = CrafterCMSNext.rxjs.operators.map;
                _context2.next = 6;
                return rxGet(url).pipe(rxMap(function (_ref7) {
                  var response = _ref7.response;
                  return response;
                })).toPromise();

              case 6:
                response = _context2.sent;
                result = response.result;

                if (!(result && result.code === 200 && result.data)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", JSON.parse(result.data) || undefined);

              case 10:
                return _context2.abrupt("return", undefined);

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](1);
                return _context2.abrupt("return", undefined);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 13]]);
      }));
      return _searchYouTube.apply(this, arguments);
    }

    function SearchBar(_ref) {
      var isViewMode = _ref.isViewMode,
          onSearchSubmit = _ref.onSearchSubmit;

      var _React$useState = React.useState(''),
          _React$useState2 = _slicedToArray(_React$useState, 2),
          keyword = _React$useState2[0],
          setKeyword = _React$useState2[1];

      var searchChange = function searchChange(e) {
        if (isViewMode) return;
        setKeyword(e.target.value);
      };

      var submitSearch = function submitSearch(e) {
        if (isViewMode) return;
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
        disabled: isViewMode
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

      var videoSearch = /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(siteId, keyword) {
          var res, video;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return searchYouTube(siteId, keyword);

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

        return function videoSearch(_x3, _x4) {
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

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "YouTube Picker"), /*#__PURE__*/React.createElement(SearchBar, {
        isViewMode: isViewMode,
        onSearchSubmit: function onSearchSubmit(keyword) {
          return videoSearch(siteId, keyword);
        }
      }), /*#__PURE__*/React.createElement(VideoDetail, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2pzL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCIuLi8uLi8uLi8uLi9zcmMvanMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBkZWZpbmUoSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIGRlZmluZShHcCwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gIGRlZmluZShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBHZW5lcmF0b3JGdW5jdGlvbik7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgZGVmaW5lKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlLCBhc3luY0l0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIGRlZmluZShHcCwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICBkZWZpbmUoR3AsIFwidG9TdHJpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIGluIG1vZGVybiBlbmdpbmVzXG4gIC8vIHdlIGNhbiBleHBsaWNpdGx5IGFjY2VzcyBnbG9iYWxUaGlzLiBJbiBvbGRlciBlbmdpbmVzIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbFRoaXMucmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbiAgfSBlbHNlIHtcbiAgICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xuICB9XG59XG4iLCJpbXBvcnQgJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBSZWFjdCA9IENyYWZ0ZXJDTVNOZXh0LlJlYWN0O1xuICB2YXIgUmVhY3RET00gPSBDcmFmdGVyQ01TTmV4dC5SZWFjdERPTTtcbiAgY29uc3QgR09PR0xFX0FQSV9QQVRIID0gJy9zdHVkaW8vYXBpLzIvcGx1Z2luL3NjcmlwdC9vcmcvY3JhZnRlcmNtcy9wbHVnaW4veW91dHViZS1waWNrZXIveW91dHViZS9hcGkuanNvbidcblxuICBhc3luYyBmdW5jdGlvbiBzZWFyY2hZb3VUdWJlKHNpdGVJZCwga2V5d29yZCkge1xuICAgIGNvbnN0IHVybCA9IGAke2xvY2F0aW9uLm9yaWdpbn0ke0dPT0dMRV9BUElfUEFUSH0/c2l0ZUlkPSR7c2l0ZUlkfSZrZXl3b3JkPSR7a2V5d29yZH1gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByeEdldCA9IENyYWZ0ZXJDTVNOZXh0LnV0aWwuYWpheC5nZXQ7XG4gICAgICBjb25zdCByeE1hcCA9IENyYWZ0ZXJDTVNOZXh0LnJ4anMub3BlcmF0b3JzLm1hcDtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcnhHZXQodXJsKS5waXBlKHJ4TWFwKCh7IHJlc3BvbnNlIH0pID0+IHJlc3BvbnNlKSkudG9Qcm9taXNlKCk7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc3BvbnNlLnJlc3VsdDtcblxuICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuY29kZSA9PT0gMjAwICYmIHJlc3VsdC5kYXRhKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3VsdC5kYXRhKSB8fCB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gU2VhcmNoQmFyKHsgaXNWaWV3TW9kZSwgb25TZWFyY2hTdWJtaXQgfSkge1xuICAgIGNvbnN0IFtrZXl3b3JkLCBzZXRLZXl3b3JkXSA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcblxuICAgIGNvbnN0IHNlYXJjaENoYW5nZSA9IChlKSA9PiB7XG4gICAgICBpZiAoaXNWaWV3TW9kZSkgcmV0dXJuO1xuXG4gICAgICBzZXRLZXl3b3JkKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc3VibWl0U2VhcmNoID0gKGUpID0+IHtcbiAgICAgIGlmIChpc1ZpZXdNb2RlKSByZXR1cm47XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9uU2VhcmNoU3VibWl0KGtleXdvcmQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17c3VibWl0U2VhcmNofSBzdHlsZT17e21hcmdpblRvcDonMjBweCd9fT5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIFlvdVR1YmVcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2VhcmNoQ2hhbmdlfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17aXNWaWV3TW9kZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gVmlkZW9MaXN0KHsgdmlkZW9zLCBvblZpZGVvU2VsZWN0IH0pIHtcbiAgICBjb25zdCBsaXN0ID0gdmlkZW9zLm1hcCgodmlkZW8pID0+XG4gICAgICA8VmlkZW9MaXN0SXRlbVxuICAgICAgICBvblZpZGVvU2VsZWN0PXtvblZpZGVvU2VsZWN0fVxuICAgICAgICBrZXk9e3ZpZGVvLmV0YWd9XG4gICAgICAgIHZpZGVvPXt2aWRlb31cbiAgICAgIC8+XG4gICAgKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImNvbC1tZC00IGxpc3QtZ3JvdXBcIiBzdHlsZT17e21hcmdpblRvcDonMjBweCd9fT5cbiAgICAgICAgICB7bGlzdH1cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIFZpZGVvTGlzdEl0ZW0oeyB2aWRlbywgb25WaWRlb1NlbGVjdCB9KSB7XG4gICAgY29uc3QgaW1nVXJsID0gdmlkZW8uc25pcHBldC50aHVtYm5haWxzLmRlZmF1bHQudXJsO1xuICAgIHJldHVybiAoXG4gICAgICA8bGkgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtXCIgIG9uQ2xpY2s9eygpID0+IG9uVmlkZW9TZWxlY3QodmlkZW8pfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ2aWRlby1saXN0LW1lZGlhXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cIm1lZGlhLW9iamVjdFwiIHNyYz17aW1nVXJsfSAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWRpYS1ib2R5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lZGlhLWhlYWRpbmdcIj5cbiAgICAgICAgICAgICAgPGRpdj57dmlkZW8uc25pcHBldC50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gVmlkZW9EZXRhaWwoeyB2aWRlbyB9KSB7XG4gICAgaWYgKCF2aWRlbykge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCB2aWRlb0lkID0gdmlkZW8uaWQudmlkZW9JZDtcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly95b3V0dWJlLmNvbS9lbWJlZC8ke3ZpZGVvSWR9YDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInZpZGVvLWRldGFpbCBjb2wtbWQtOFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVtYmVkLXJlc3BvbnNpdmUgZW1iZWQtcmVzcG9uc2l2ZS0xNmJ5OVwiIHN0eWxlPXt7bWFyZ2luVG9wOicyMHB4J319PlxuICAgICAgICAgIDxpZnJhbWUgY2xhc3NOYW1lPVwiZW1iZWQtcmVzcG9uc2l2ZS1pdGVtXCIgc3JjPXt1cmx9PjwvaWZyYW1lPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXRhaWxzXCI+XG4gICAgICAgICAgPGRpdj57dmlkZW8uc25pcHBldC50aXRsZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2Pnt2aWRlby5zbmlwcGV0LmRlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIE15UGlja2VyKHsgc2l0ZUlkLCBpc1ZpZXdNb2RlIH0pIHtcbiAgICBjb25zdCBbc2VsZWN0ZWRWaWRlbywgc2V0U2VsZWN0ZWRWaWRlb10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbdmlkZW9zLCBzZXRWaWRlb3NdID0gUmVhY3QudXNlU3RhdGUoW10pO1xuXG4gICAgY29uc3QgdmlkZW9TZWFyY2ggPSBhc3luYyAoc2l0ZUlkLCBrZXl3b3JkKSA9PiB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBzZWFyY2hZb3VUdWJlKHNpdGVJZCwga2V5d29yZCk7XG5cbiAgICAgIGlmIChyZXMgJiYgcmVzLml0ZW1zICYmIHJlcy5pdGVtcy5sZW5ndGggPj0gMCkge1xuICAgICAgICBzZXRWaWRlb3MocmVzLml0ZW1zKTtcbiAgICAgICAgc2V0U2VsZWN0ZWRWaWRlbyhyZXMuaXRlbXNbMF0pO1xuICAgICAgICBjb25zdCB2aWRlbyA9IHJlcy5pdGVtc1swXTtcbiAgICAgICAgdXBkYXRlSW5wdXRzKHZpZGVvKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgb25TZWxlY3RWaWRlbyA9ICh2aWRlbykgPT4ge1xuICAgICAgc2V0U2VsZWN0ZWRWaWRlbyh2aWRlbyk7XG4gICAgICB1cGRhdGVJbnB1dHModmlkZW8pO1xuICAgIH07XG5cbiAgICBjb25zdCB1cGRhdGVJbnB1dHMgPSAodmlkZW8pID0+IHtcbiAgICAgIGlmICh0eXBlb2YgJCAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXG4gICAgICBjb25zdCAkeW91dHViZUlkRWwgPSAkKCcjeW91dHViZUlEX3MgaW5wdXQnKTtcbiAgICAgIGNvbnN0IGlzSWRFbERpc2FibGVkID0gQm9vbGVhbigkeW91dHViZUlkRWwuYXR0cignZGlzYWJsZWQnKSk7XG4gICAgICBjb25zdCAkdGl0bGVFbCA9ICQoJyN0aXRsZV9zIGlucHV0Jyk7XG4gICAgICBjb25zdCBpc1RpdGxlRWxEaXNhYmxlZCA9IEJvb2xlYW4oJHRpdGxlRWwuYXR0cignZGlzYWJsZWQnKSk7XG4gICAgICBjb25zdCAkZGVzY3JpcHRpb25FbCA9ICQoJyNkZXNjcmlwdGlvbl90IHRleHRhcmVhJyk7XG4gICAgICBjb25zdCBpc0Rlc2NyaXB0aW9uRWxEaXNhYmxlZCA9IEJvb2xlYW4oJGRlc2NyaXB0aW9uRWwuYXR0cignZGlzYWJsZWQnKSk7XG4gICAgICBjb25zdCAkcG9zdGVySW1hZ2VFbCA9ICAkKCcjcG9zdGVySW1hZ2VfcyBpbnB1dCcpO1xuICAgICAgY29uc3QgaXNQb3N0ZXJJbWFnZUVsRGlzYWJsZWQgPSBCb29sZWFuKCRwb3N0ZXJJbWFnZUVsLmF0dHIoJ2Rpc2FibGVkJykpO1xuXG4gICAgICBpc0lkRWxEaXNhYmxlZCAmJiAkeW91dHViZUlkRWwucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICBpc1RpdGxlRWxEaXNhYmxlZCAmJiAkdGl0bGVFbC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgIGlzRGVzY3JpcHRpb25FbERpc2FibGVkICYmICRkZXNjcmlwdGlvbkVsLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgaXNQb3N0ZXJJbWFnZUVsRGlzYWJsZWQgJiYgJHBvc3RlckltYWdlRWwucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICR5b3V0dWJlSWRFbC5mb2N1cygpO1xuICAgICAgJHlvdXR1YmVJZEVsLnZhbCh2aWRlby5pZC52aWRlb0lkKTtcblxuICAgICAgJHRpdGxlRWwuZm9jdXMoKTtcbiAgICAgICR0aXRsZUVsLnZhbCh2aWRlby5zbmlwcGV0LnRpdGxlKTtcblxuICAgICAgJGRlc2NyaXB0aW9uRWwuZm9jdXMoKTtcbiAgICAgICRkZXNjcmlwdGlvbkVsLnZhbCh2aWRlby5zbmlwcGV0LmRlc2NyaXB0aW9uKTtcblxuICAgICAgJHBvc3RlckltYWdlRWwuZm9jdXMoKTtcbiAgICAgICRwb3N0ZXJJbWFnZUVsLnZhbCh2aWRlby5zbmlwcGV0LnRodW1ibmFpbHMuaGlnaC51cmwpO1xuICAgICAgJHBvc3RlckltYWdlRWwuYmx1cigpO1xuXG4gICAgICBpc0lkRWxEaXNhYmxlZCAmJiAkeW91dHViZUlkRWwucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgIGlzVGl0bGVFbERpc2FibGVkICYmICR0aXRsZUVsLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICBpc0Rlc2NyaXB0aW9uRWxEaXNhYmxlZCAmJiAkZGVzY3JpcHRpb25FbC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgaXNQb3N0ZXJJbWFnZUVsRGlzYWJsZWQgJiYgJHBvc3RlckltYWdlRWwucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGg0PllvdVR1YmUgUGlja2VyPC9oND5cbiAgICAgICAgPFNlYXJjaEJhclxuICAgICAgICAgIGlzVmlld01vZGU9e2lzVmlld01vZGV9XG4gICAgICAgICAgb25TZWFyY2hTdWJtaXQ9eyhrZXl3b3JkKSA9PiB2aWRlb1NlYXJjaChzaXRlSWQsIGtleXdvcmQpfVxuICAgICAgICAvPlxuICAgICAgICA8VmlkZW9EZXRhaWwgdmlkZW89e3NlbGVjdGVkVmlkZW99Lz5cbiAgICAgICAgPFZpZGVvTGlzdFxuICAgICAgICAgIG9uVmlkZW9TZWxlY3Q9eyhzZWxlY3RlZFZpZGVvKSA9PiBvblNlbGVjdFZpZGVvKHNlbGVjdGVkVmlkZW8pfVxuICAgICAgICAgIHZpZGVvcz17dmlkZW9zfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIENTdHVkaW9Gb3Jtcy5Db250cm9scy5Zb3V0dWJlID1cbiAgQ1N0dWRpb0Zvcm1zLkNvbnRyb2xzLllvdXR1YmUgfHxcbiAgZnVuY3Rpb24oaWQsIGZvcm0sIG93bmVyLCBwcm9wZXJ0aWVzLCBjb25zdHJhaW50cykge1xuICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICB0aGlzLm93bmVyLnJlZ2lzdGVyRmllbGQodGhpcyk7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIHRoaXMuY29uc3RyYWludHMgPSBjb25zdHJhaW50cztcbiAgICB0aGlzLmlucHV0RWwgPSBudWxsO1xuICAgIHRoaXMuY291bnRFbCA9IG51bGw7XG4gICAgdGhpcy5yZXF1aXJlZCA9IGZhbHNlO1xuICAgIHRoaXMudmFsdWUgPSAnX25vdC1zZXQnO1xuICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuc3VwcG9ydGVkUG9zdEZpeGVzID0gWydfcyddO1xuXG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgIHZhciByZXF1aXJlZCA9IGNvbnN0cmFpbnRzLmZpbmQoZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5Lm5hbWUgPT09ICdyZXF1aXJlZCc7XG4gICAgICB9KTtcbiAgICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgICB0aGlzLnJlcXVpcmVkID0gcmVxdWlyZWQudmFsdWUgPT09ICd0cnVlJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBZQUhPTy5leHRlbmQoQ1N0dWRpb0Zvcm1zLkNvbnRyb2xzLllvdXR1YmUsIENTdHVkaW9Gb3Jtcy5DU3R1ZGlvRm9ybUZpZWxkLCB7XG4gICAgZ2V0TGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdZb3VUdWJlIFBpY2tlcic7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oY29uZmlnLCBjb250YWluZXJFbCkge1xuICAgICAgY29udGFpbmVyRWwuaWQgPSB0aGlzLmlkO1xuICAgICAgY29uc3QgaXNWaWV3TW9kZSA9IENTdHVkaW9Gb3Jtcy5lbmdpbmUuY29uZmlnLnJlYWRvbmx5O1xuXG4gICAgICBjb25zdCBzaXRlSWQgPSBDU3R1ZGlvQXV0aG9yaW5nQ29udGV4dC5zaXRlO1xuICAgICAgUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQaWNrZXIsIHsgc2l0ZUlkLCBpc1ZpZXdNb2RlIH0pLCBjb250YWluZXJFbCk7XG4gICAgfSxcblxuICAgIGdldFZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH0sXG5cbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9LFxuXG4gICAgZ2V0TmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ3lvdXR1YmUnO1xuICAgIH0sXG5cbiAgICBnZXRTdXBwb3J0ZWRQcm9wZXJ0aWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuXG4gICAgZ2V0U3VwcG9ydGVkQ29uc3RyYWludHM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG5cbiAgICBnZXRTdXBwb3J0ZWRQb3N0Rml4ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3VwcG9ydGVkUG9zdEZpeGVzO1xuICAgIH1cbiAgfSk7XG5cbiAgQ1N0dWRpb0F1dGhvcmluZy5Nb2R1bGUubW9kdWxlTG9hZGVkKCd5b3V0dWJlJywgQ1N0dWRpb0Zvcm1zLkNvbnRyb2xzLllvdXR1YmUpO1xufSkoKTtcbiJdLCJuYW1lcyI6WyJ1bmRlZmluZWQiLCJSZWFjdCIsIkNyYWZ0ZXJDTVNOZXh0IiwiUmVhY3RET00iLCJHT09HTEVfQVBJX1BBVEgiLCJzZWFyY2hZb3VUdWJlIiwic2l0ZUlkIiwia2V5d29yZCIsInVybCIsImxvY2F0aW9uIiwib3JpZ2luIiwicnhHZXQiLCJ1dGlsIiwiYWpheCIsImdldCIsInJ4TWFwIiwicnhqcyIsIm9wZXJhdG9ycyIsIm1hcCIsInBpcGUiLCJyZXNwb25zZSIsInRvUHJvbWlzZSIsInJlc3VsdCIsImNvZGUiLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwiU2VhcmNoQmFyIiwiaXNWaWV3TW9kZSIsIm9uU2VhcmNoU3VibWl0IiwidXNlU3RhdGUiLCJzZXRLZXl3b3JkIiwic2VhcmNoQ2hhbmdlIiwiZSIsInRhcmdldCIsInZhbHVlIiwic3VibWl0U2VhcmNoIiwicHJldmVudERlZmF1bHQiLCJtYXJnaW5Ub3AiLCJWaWRlb0xpc3QiLCJ2aWRlb3MiLCJvblZpZGVvU2VsZWN0IiwibGlzdCIsInZpZGVvIiwiZXRhZyIsIlZpZGVvTGlzdEl0ZW0iLCJpbWdVcmwiLCJzbmlwcGV0IiwidGh1bWJuYWlscyIsInRpdGxlIiwiVmlkZW9EZXRhaWwiLCJ2aWRlb0lkIiwiaWQiLCJkZXNjcmlwdGlvbiIsIk15UGlja2VyIiwic2VsZWN0ZWRWaWRlbyIsInNldFNlbGVjdGVkVmlkZW8iLCJzZXRWaWRlb3MiLCJ2aWRlb1NlYXJjaCIsInJlcyIsIml0ZW1zIiwibGVuZ3RoIiwidXBkYXRlSW5wdXRzIiwib25TZWxlY3RWaWRlbyIsIiQiLCIkeW91dHViZUlkRWwiLCJpc0lkRWxEaXNhYmxlZCIsIkJvb2xlYW4iLCJhdHRyIiwiJHRpdGxlRWwiLCJpc1RpdGxlRWxEaXNhYmxlZCIsIiRkZXNjcmlwdGlvbkVsIiwiaXNEZXNjcmlwdGlvbkVsRGlzYWJsZWQiLCIkcG9zdGVySW1hZ2VFbCIsImlzUG9zdGVySW1hZ2VFbERpc2FibGVkIiwicHJvcCIsImZvY3VzIiwidmFsIiwiaGlnaCIsImJsdXIiLCJDU3R1ZGlvRm9ybXMiLCJDb250cm9scyIsIllvdXR1YmUiLCJmb3JtIiwib3duZXIiLCJwcm9wZXJ0aWVzIiwiY29uc3RyYWludHMiLCJyZWdpc3RlckZpZWxkIiwiZXJyb3JzIiwiaW5wdXRFbCIsImNvdW50RWwiLCJyZXF1aXJlZCIsInN1cHBvcnRlZFBvc3RGaXhlcyIsImZpbmQiLCJwcm9wZXJ0eSIsIm5hbWUiLCJZQUhPTyIsImV4dGVuZCIsIkNTdHVkaW9Gb3JtRmllbGQiLCJnZXRMYWJlbCIsInJlbmRlciIsImNvbmZpZyIsImNvbnRhaW5lckVsIiwiZW5naW5lIiwicmVhZG9ubHkiLCJDU3R1ZGlvQXV0aG9yaW5nQ29udGV4dCIsInNpdGUiLCJjcmVhdGVFbGVtZW50IiwiZ2V0VmFsdWUiLCJzZXRWYWx1ZSIsImdldE5hbWUiLCJnZXRTdXBwb3J0ZWRQcm9wZXJ0aWVzIiwiZ2V0U3VwcG9ydGVkQ29uc3RyYWludHMiLCJnZXRTdXBwb3J0ZWRQb3N0Rml4ZXMiLCJDU3R1ZGlvQXV0aG9yaW5nIiwiTW9kdWxlIiwibW9kdWxlTG9hZGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLE9BQU8sSUFBSSxVQUFVLE9BQU8sRUFBRTtBQUVsQztFQUNBLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztFQUM1QixFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7RUFDakMsRUFBRSxJQUFJQSxXQUFTLENBQUM7RUFDaEIsRUFBRSxJQUFJLE9BQU8sR0FB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

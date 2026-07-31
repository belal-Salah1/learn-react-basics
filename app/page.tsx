'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./components/Card";
import Desc from "./components/Description";
import Header from "./components/Header";

const GOAL = 10;

function Home() {
  const showDescription = true;
  const [counter, setCounter] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldCalculate, setShouldCalculate] = useState<boolean>(false);

  const CalculateIncome = () => {
    let number = 10;
    for (let i = 0; i < 10000; i++) {
      number += i;
    }
    console.log("Calculation....");
    return number;
  };

  const income = useMemo(() => CalculateIncome(), [shouldCalculate]);

  const handleClick = () => {
    setCounter(counter + 1);
    if (counter + 1 === GOAL) {
      setSuccess(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input value changed:", event.target.value);
  };

  const handleFocus = () => {
    inputRef.current?.focus();
    console.log("Input is focused", inputRef.current?.value);
  };

  useEffect(() => {
    console.log("event is successful");
  }, [success]);

  useEffect(() => {
    console.log("Counter is triggered");
  }, [counter]);

  return (
    <div className="space-y-8">
      <Header
        text="React Hooks Playground"
        textSubtitle="Practicing state, refs, effects, and memoization."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card hook="useState" title="Counter">
          <p className="text-4xl font-semibold tabular-nums tracking-tight">
            {counter}
          </p>
          <button
            onClick={handleClick}
            className="mt-4 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Increment
          </button>
          <p className="mt-3 text-xs text-muted">
            {success
              ? `Unlocked at ${GOAL}`
              : `${GOAL - counter} more to unlock`}
          </p>
        </Card>

        <Card hook="useRef" title="Focus an input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter your name"
            onChange={handleInputChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <button
            onClick={handleFocus}
            className="mt-3 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Focus input
          </button>
        </Card>

        <Card
          hook="useMemo"
          title="Expensive calculation"
          className="sm:col-span-2"
        >
          <p className="font-mono text-sm">
            <span className="text-muted">cached result: </span>
            {income.toLocaleString("en-US")}
          </p>
          <button
            onClick={() => setShouldCalculate((v) => !v)}
            className="mt-3 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Recalculate
          </button>
        </Card>
      </div>

      {showDescription && <Desc />}
    </div>
  );
}

export default Home;

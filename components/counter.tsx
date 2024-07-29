"use client";
import { decrease, increase, reset } from "@/featuires/counter/counter-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import React from "react";

type Props = {};

export default function Counter({}: Props) {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-x-3 items-center">
        <button className="border p-1" onClick={() => dispatch(decrease())}>Decrease</button>
        <p>{count}</p>
        <button className="border p-1" onClick={() => dispatch(increase())}>Increase</button>
      </div>
      <button className="border p-1" onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}

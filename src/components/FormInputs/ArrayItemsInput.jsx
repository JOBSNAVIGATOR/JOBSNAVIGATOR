"use client";
import React, { useState } from "react";
import { CircleX, Palette, Plus, X } from "lucide-react";
export default function ArrayItemsInput({ items, setItems, itemTitle }) {
  const [showItemForm, setShowItemForm] = useState(false);
  const [item, setItem] = useState("");

  function addItem() {
    setItems([...items, item]);
    setItem("");
  }

  function removeItem(index) {
    const newTags = [...items];
    newTags.splice(index, 1);
    setItems(newTags);
  }
  return (
    <div className="sm:col-span-2">
      {showItemForm ? (
        <div className="flex items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Palette className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              type="text"
              id="voice-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
              placeholder={`Create a ${itemTitle} ...`}
            />
          </div>
          <button
            onClick={addItem}
            disabled={item ? false : true}
            type="button"
            className="shrink-0 inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-lime-700 rounded-lg border border-lime-700 hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-lime-300 dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
          >
            <Plus className="w-4 h-4 me-2" />
            Add
          </button>

          <button
            type="button"
            onClick={() => setShowItemForm(false)}
            className="ml-3 shrink-0 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowItemForm(true)}
          type="button"
          className="dark:text-slate-300 shrink-0 inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-lime-700 rounded-lg border border-lime-700 hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-lime-300 dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
        >
          <Plus />
          <span>Add {itemTitle}</span>
        </button>
      )}

      <div className="flex flex-wrap gap-4 mt-4">
        {items.map((item, index) => {
          return (
            <div
              onClick={() => removeItem(index)}
              className="flex space-x-2 items-center bg-slate-200 dark:bg-slate-600 px-4 py-2 rounded-lg cursor-pointer dark:text-slate-300 text-slate-800"
              key={index}
            >
              <p>{item}</p>

              <CircleX className="w-4 h-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

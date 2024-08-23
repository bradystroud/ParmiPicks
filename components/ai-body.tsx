import OpenAI from "openai";
import React, { useState } from "react";
import { FaMagic } from "react-icons/fa";

export const aiBody = ({ input }) => {
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState("no review yet");
  const [loading, setLoading] = useState(false);
  return (
    <>
      <h3>Notes</h3>
      <div className="flex justify-between">
        <div>
          <textarea
            className="min-w-56 m-2 shadow-inner text-base px-3 py-2 text-gray-600 resize-y focus:shadow-outline focus:border-blue-500 block w-full border border-gray-200 focus:text-gray-900 rounded-md"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your notes and we'll generate a review 🤖"
          />
        </div>
        <div className="flex flex-col">
          <button
            onClick={async () => {
              setLoading(true);
              console.log("generating content");

              const openai = new OpenAI({
                apiKey:
                "test",
                dangerouslyAllowBrowser: true,
              });

              const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content:
                      "You are a content writer. You take notes from the user and turn them into a review (in Markdown, but no headings needed).",
                  },
                  {
                    role: "user",
                    content: "here are the notes: " + notes,
                  },
                ],
              });
              setLoading(false);

              const content = completion.choices[0].message.content;
              console.log(completion.choices[0].message);
              setReview(content);
              input.onChange(content);
            }}
            className="icon-parent pl-4 inline-flex items-center font-medium focus:outline-none focus:ring-2 focus:shadow-outline text-center inline-flex justify-center transition-all duration-150 ease-out  shadow text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 border-0 text-sm h-10 px-4  rounded-full "
          >
            <FaMagic />
          </button>

          {loading && (
            <img
              className="pt-1"
              style={{ width: "50px" }}
              src="/llama_thinking.png"
              alt="orange llama thinking"
            />
          )}
        </div>
      </div>
      <h3>✨ Body</h3>
      <textarea
        {...input}
        className="min-h-60	 m-2 shadow-inner text-base px-3 py-2 text-gray-600 resize-y focus:shadow-outline focus:border-blue-500 block w-full border border-gray-200 focus:text-gray-900 rounded-md"
      />
    </>
  );
};

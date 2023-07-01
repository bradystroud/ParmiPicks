import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import format from "date-fns/format";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

// Use the props returned by get static props
export default function ReviewPage(
  props: AsyncReturnType<typeof getStaticProps>["props"]
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const [funText, setFunText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const doCoolStuff = async (style: string) => {
    if (!style || style === "") {
      return;
    }

    // Start spinner
    setIsLoading(true);
    const reviewText = await getFunReview(
      data.review._body,
      data.review.score,
      style
    );
    setFunText(reviewText);
    // Stop spinner
    setIsLoading(false);
  };

  const date = new Date(data.review.date);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, "MMM dd, yyyy");
  }

  if (data && data.review) {
    return (
      <Layout rawData={data} data={data.global as any}>
        <Section className="flex-1">
          <Container width="small" className={`flex-1 pb-2`} size="large">
            <h1
              className={`w-full relative	mb-8 text-6xl tracking-normal text-center title-font`}
            >
              <span className="font-extrabold">{data.review.score}</span> -{" "}
              {data.review.restaurant.name}
            </h1>
            <div className="relative w-300 h-400 m-auto">
              {data?.review?.parmiImg ? (
                <img src={data.review?.parmiImg} />
              ) : (
                "No image 🫢"
              )}
            </div>
            <div
              data-tinafield="author"
              className="flex items-center justify-center my-8"
            >
              {data.review.author && (
                <>
                  <div className="flex-shrink-0 mr-4">
                    <img
                      className="h-14 w-14 object-cover rounded-full shadow-sm"
                      src={data.review.author.avatar}
                      alt={data.review.author.name}
                    />
                  </div>
                  <p className="text-base font-medium text-gray-600 group-hover:text-gray-800 dark:text-gray-200 dark:group-hover:text-white">
                    {data.review.author.name}
                  </p>
                  <span className="font-bold text-gray-200 dark:text-gray-500 mx-2">
                    —
                  </span>
                </>
              )}
              <p
                data-tinafield="date"
                className="text-base text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-150"
              >
                {formattedDate}
              </p>
            </div>
          </Container>
          <Container className={`flex-1 pt-4`} width="small" size="large">
            <div className="prose dark:prose-dark w-full max-w-none">
              <TinaMarkdown content={data.review._body} />
            </div>
            {isLoading ? (
              <FaSpinner className="mx-auto animate-spin w-8 h-8" />
            ) : (
              <p>{funText}</p>
            )}
          </Container>
          <Container className={`flex-1 pt-4`} width="small" size="large">
            <div className="prose dark:prose-dark w-full max-w-none">
              <h3>Make the review more fun</h3>
              <StyleSelect onChange={doCoolStuff} />
            </div>
            <ChatInterface />
          </Container>
        </Section>
      </Layout>
    );
  }
  return (
    <Layout>
      <div>No data</div>;
    </Layout>
  );
}

const getFunReview = async (notes: any, score: any, option: string) => {
  // Call OpenAI API to generate a review
  // https://beta.openai.com/docs/api-reference/completions/create

  // Use the review notes as the prompt
  console.log(process.env.NEXT_PUBLIC_TINA_BRANCH);

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_TINA_BRANCH,
  });
  const openai = new OpenAIApi(configuration);

  const lines = notes.children[0].children
    .map((li) => li.children[0].children[0].text)
    .join("\n");
  console.log(lines);

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a chicken parmi reviewer." },
      { role: "system", content: lines },
      { role: "system", content: `This parmi scored a ${score}.` },
      { role: "system", content: `Write a review in the style of ${option}` },
    ],
  });

  console.log(chatCompletion.data.choices[0].message);

  return chatCompletion.data.choices[0].message.content;
};

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.reviewQuery({
    relativePath: `${params.filename}.mdx`,
  });
  return {
    props: {
      ...tinaProps,
    },
  };
};

export const getStaticPaths = async () => {
  const reviewsListData = await client.queries.reviewConnection();
  return {
    paths: reviewsListData.data.reviewConnection.edges.map((post) => ({
      params: { filename: post.node._sys.filename },
    })),
    fallback: "blocking",
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

const ChatInterface = () => {
  return (
    <>
      <div className="flex flex-col h-screen shadow-lg bg-white bg-opacity-5 p-10 rounded-lg">
        <div className="flex flex-row text-white p-3">
          <h1 className="font-bold text-xl">Chat with the reviewer 🤖</h1>
        </div>
        <div className="flex-grow overflow-auto p-3">
          <div className="flex flex-row justify-end mb-2">
            <div className="text-sm bg-white text-gray-800 rounded py-1 px-2">
              Hello, how are you?
            </div>
          </div>
          <div className="flex flex-row justify-start mb-2">
            <div className="text-sm bg-white text-gray-800 rounded py-1 px-2">
              I'm fine. Thanks!
            </div>
          </div>
        </div>
        <div className="flex flex-row bg-white border-t-2 p-3">
          <input
            className="flex-grow border rounded px-2 py-1"
            placeholder="Type your message here..."
          />
          <button className="ml-2 bg-indigo-600 text-white rounded px-2 py-1">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

// TODO: Select - move to file
interface StyleSelectProps {
  onChange: (value: string) => Promise<void>;
}

const StyleSelect: React.FC<StyleSelectProps> = ({ onChange }) => {
  return (
    <select
      onChange={async (e) => await onChange(e.target.value)}
      className="block w-full py-2 px-3 border border-gray-300 bg-gray-100 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      <option value="">--Select an option--</option>
      <option value="Dr Suess">Dr Suess</option>
      <option value="Michael Scott from the Office, make a few references to the show">
        Michael Scott
      </option>
      <option value="Peaky Blinders - use lots of english slang, innit">
        Peaky Blinders
      </option>
    </select>
  );
};

import { Client } from "pg";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { v4 as uuidv4 } from "uuid";

const TweetContractAddress = "0x9af78379C99f8b92aC4fc11aAB69212b6B6F95d0";
const TweetABI: AbiItem[] = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "getAllUrls",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const getPgClient = async () => {
  const client = new Client({
    host: "localhost",
    database: "appdb_dev",
    user: "user",
    password: "password",
  });
  await client.connect();
  return client;
};

const addLinksToDb = async (
  client: Client,
  domainId: string,
  urls: string[]
) => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    if (!url) {
      console.log(`Url "${url}" with index ${i} is not defined, skip`);
      continue;
    }

    const linkId = i;
    const { rowCount: existedUrlCount } = await client.query(
      'select * from public."Links" where url = $1 and "linkId" = $2 and "domainId" = $3',
      [url, linkId, domainId]
    );
    if (existedUrlCount > 0) {
      console.log(`Url ${url} already in DB, skip`);
      continue;
    }
    const id = uuidv4();
    await client.query(
      'insert into public."Links" ("id", "domainId", "linkId", "url", "createdAt", "updatedAt") values ($1, $2, $3, $4, NOW(), NOW())',
      [id, domainId, linkId, url]
    );
    console.log(`Url "${url}" inserted with uuid ${id}, linkId ${linkId}`);
  }
};

const run = async () => {
  const pgClient = await getPgClient();
  const web3 = new Web3("https://api.s0.t.hmny.io");
  const tweetContract = new web3.eth.Contract(TweetABI, TweetContractAddress);
  const { rows: dbDomains } = await pgClient.query(
    'select * from public."Domains"',
    []
  );
  console.log(
    "DB domains: ",
    dbDomains.map((item) => item.domain).join(", "),
    `(total: ${dbDomains.length})`
  );

  for (let i = 0; i < dbDomains.length; i++) {
    const dbDomain = dbDomains[i];
    const urlsRaw = await tweetContract.methods
      .getAllUrls(dbDomain.domain)
      .call();
    const urls = urlsRaw.map((url: string) => {
      const [, extractedUrl] = url.split("url:");
      return extractedUrl;
    });
    console.log(
      "Domain",
      dbDomain.domain,
      "urls from contract:",
      urlsRaw,
      ", parsed urls:",
      urls
    );
    await addLinksToDb(pgClient, dbDomain.id, urls);
  }

  console.log("Task completed, exit");
  process.exit(1);
};

run();

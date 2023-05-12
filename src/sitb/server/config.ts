import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import type { Configuration, Connection, IDatabaseDriver, Options } from '@mikro-orm/core'

const rwd = process.env.VERCEL ? '/vercel/path0' : '.';	// TODO: find a prettier solution
	
export default function config(env: Record<string, string|undefined>): Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> {
	return {
		//debug: ['discovery'],
		entities: [`${rwd}/src/entities/**/*.ts`],
		entitiesTs: [`${rwd}/src/entities/**/*.ts`],
		metadataProvider: TsMorphMetadataProvider,
		// TODO: this last part should be project-dependant
		type: "mongo",
		highlighter: new MongoHighlighter(),
		clientUrl: env.MONGODB_URI
	};
}
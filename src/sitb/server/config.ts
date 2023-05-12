import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import type { Configuration, Connection, IDatabaseDriver, Options } from '@mikro-orm/core'
console.log('cwd', process.cwd());
export default function config(env: Record<string, string|undefined>): Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> {
	return {
		debug: ['discovery'],
		entities: ['./src/entities/**/*.ts'],
		entitiesTs: ['./src/entities/**/*.ts'],
		metadataProvider: TsMorphMetadataProvider,
		// TODO: this last part should be project-dependant
		type: "mongo",
		highlighter: new MongoHighlighter(),
		clientUrl: env.MONGODB_URI
	};
}
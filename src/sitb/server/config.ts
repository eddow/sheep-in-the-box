import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { ReflectMetadataProvider } from "@mikro-orm/core";
import type { Configuration, Connection, IDatabaseDriver, Options } from '@mikro-orm/core'

export default function config(env: Record<string, string|undefined>): Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> {
	return {
		debug: ['discovery'],
		entities: ['./src/entities/**/*.ts'],
		//entitiesTs: ['./src/entities/**/*.ts'],
		metadataProvider: ReflectMetadataProvider,
		// TODO: this last part should be project-dependant
		type: "mongo",
		highlighter: new MongoHighlighter(),
		clientUrl: env.MONGODB_URI
	};
}
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import type { Configuration, Connection, IDatabaseDriver, Options } from '@mikro-orm/core'

export default function config(env: Record<string, string|undefined>): Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> {
	return {
		// + './src/lib/entities/**/*.ts'
		entities: ['./src/sitb/entities/**/*.ts'],
		entitiesTs: ['./src/sitb/entities/**/*.ts'],
		metadataProvider: TsMorphMetadataProvider,
		migrations: {
			emit: "js"
		},
		type: "mongo",
		highlighter: new MongoHighlighter(),
		clientUrl: env.MONGODB_URI
	};
}
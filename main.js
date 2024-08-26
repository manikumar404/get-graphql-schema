const fs =  require('fs')

const { buildClientSchema } = require('graphql/utilities/buildClientSchema');
const {printSchema} = require('graphql/utilities/schemaPrinter');

function main() {
    getRemoteSchema(
        '<url>',
        {
            method: 'POST',
            headers: {
                'user-agent': 'JS GraphQL',
                'Content-Type': 'application/json',
                'Authorization': '<token>'
            },
        }
    ).then(res => {
        const schema = buildClientSchema(res);
        const schemaToWrite = printSchema(schema)
        printToFile('schema.graphql', schemaToWrite)
    });
}

function printToFile(dist, schema,) {
    try {
        fs.writeFileSync(dist, schema)
        return { status: 'ok', path: output }
    } catch (err) {
        return { status: 'err', message: err.message }
    }
}

async function getRemoteSchema(endpoint, options) {
        const response = await fetch(endpoint, {
            method: options.method,
            headers: options.headers,
            body: JSON.stringify({ query: getIntrospectionQuery() }),
        }).then(res=> res.json());
    return response.data;
}

function getIntrospectionQuery(options) {
    const optionsWithDefault = {
        descriptions: true,
        specifiedByUrl: false,
        directiveIsRepeatable: false,
        schemaDescription: false,
        inputValueDeprecation: false,
        ...options,
    };

    const descriptions = optionsWithDefault.descriptions ? 'description' : '';
    const specifiedByUrl = optionsWithDefault.specifiedByUrl
        ? 'specifiedByURL'
        : '';
    const directiveIsRepeatable = optionsWithDefault.directiveIsRepeatable
        ? 'isRepeatable'
        : '';
    const schemaDescription = optionsWithDefault.schemaDescription
        ? descriptions
        : '';

    function inputDeprecation(str) {
        return optionsWithDefault.inputValueDeprecation ? str : '';
    }

    return `query IntrospectionQuery {
      __schema {
        ${schemaDescription}
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
        directives {
          name
          ${descriptions}
          ${directiveIsRepeatable}
          locations
          args${inputDeprecation('(includeDeprecated: true)')} {
            ...InputValue
          }
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      ${descriptions}
      ${specifiedByUrl}
      fields(includeDeprecated: true) {
        name
        ${descriptions}
        args${inputDeprecation('(includeDeprecated: true)')} {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields${inputDeprecation('(includeDeprecated: true)')} {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        ${descriptions}
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      ${descriptions}
      type { ...TypeRef }
      defaultValue
      ${inputDeprecation('isDeprecated')}
      ${inputDeprecation('deprecationReason')}
    }

    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}
main()

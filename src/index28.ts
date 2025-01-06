import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const csvLoader = new CSVLoader("assets/ideas_de_negocio.csv");

const embeddings = new FireworksEmbeddings({
  modelName: "nomic-ai/nomic-embed-text-v1.5",
});

const vectorStore = new FaissStore(embeddings, {});

const main = async () => {
  // Al cargar un CSV, se crea un array de objetos donde cada objeto es una fila del
  // CSV que es interpretada como un documento individual.
  const myCsv = await csvLoader.load();

  // Procesar cada documento para asignar el _id como id
  const processedDocuments = myCsv.map((doc) => {
    const content = doc.pageContent.split("\n");
    const idLine = content.find((line) => line.startsWith("_id:"));
    if (idLine) {
      const id = idLine.split(":")[1].trim();
      doc.id = id;
    }
    return doc;
  });

  // Agregar los documentos procesados al vector store
  await vectorStore.addDocuments(processedDocuments);

  // Realizar una búsqueda de similitud
  const query = "¿Cuáles son las ideas de negocio más innovadoras?";
  const searchResults = await vectorStore.similaritySearch(query, 5);

  console.log(searchResults);
};

main().catch(console.error);

/* Terminal output:

[
  Document {
    pageContent: '_id: 66fe991d078e533223893e46\n' +
      'app: asesorías virtuales para startups (general)\n' +
      'moto: Lleva tu negocio al siguiente nivel con los mejores expertos.\n' +
      'detail: Plataforma que conecta startups con una red de asesores especializados en diferentes áreas (marketing, finanzas, legal, etc.), ofreciendo sesiones de consultoría virtual y recursos personalizados.',
    metadata: { source: 'assets/ideas_de_negocio.csv', line: 9 },
    id: '66fe991d078e533223893e46'
  },
  Document {
    pageContent: '_id: 66fe991d078e533223893e44\n' +
      'app: Plataforma educativa para coaching de emprendedores\n' +
      'moto: Mentoría en línea para impulsar tu negocio.\n' +
      'detail: Espacio virtual que ofrece cursos, webinars y sesiones de coaching personalizadas para emprendedores en diferentes etapas de sus proyectos, con acceso a una red de mentores expertos.',
    metadata: { source: 'assets/ideas_de_negocio.csv', line: 7 },
    id: '66fe991d078e533223893e44'
  },
  Document {
    pageContent: '_id: 66fe991d078e533223893e42\n' +
      'app: Organizador de eventos tipo Startup Weekend\n' +
      'moto: Conecta emprendedores y desarrolla ideas en un fin de semana.\n' +
      'detail: Plataforma que facilita la organización y gestión de eventos de emprendimiento, incluyendo herramientas para la formación de equipos, mentorías en vivo y presentaciones de proyectos.',
    metadata: { source: 'assets/ideas_de_negocio.csv', line: 5 },
    id: '66fe991d078e533223893e42'
  },
  Document {
    pageContent: '_id: 66fe991d078e533223893e50\n' +
      'app: Marketplace para conectar freelance con clientes\n' +
      'moto: Encuentra los mejores talentos para tu proyecto.\n' +
      'detail: Plataforma que conecta freelancers con clientes potenciales, ofreciendo un sistema de perfiles verificados, gestión de proyectos integrada, pagos seguros y resolución de disputas.',
    metadata: { source: 'assets/ideas_de_negocio.csv', line: 19 },
    id: '66fe991d078e533223893e50'
  },
  Document {
    pageContent: '_id: 66fe991d078e533223893e4c\n' +
      'app: Herramienta de gestión de inventarios para tiendas pequeñas\n' +
      'moto: Controla tu inventario sin esfuerzo.\n' +
      'detail: Software que permite a pequeñas tiendas rastrear inventario en tiempo real, generar alertas de reposición, analizar tendencias de ventas y gestionar proveedores, todo desde una interfaz intuitiva.',
    metadata: { source: 'assets/ideas_de_negocio.csv', line: 15 },
    id: '66fe991d078e533223893e4c'
  }
]
*/

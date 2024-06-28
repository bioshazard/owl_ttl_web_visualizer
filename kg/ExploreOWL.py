from rdflib import Graph, RDF, OWL, Namespace
from neo4j import GraphDatabase

from constanst import NEO4J_URI, NEO4J_AUTH

driver = GraphDatabase.driver(NEO4J_URI, auth=NEO4J_AUTH)

def extract_name(url):
    return url.split('#')[-1]


def clean_db(tx):
    tx.run("MATCH (n) DETACH DELETE n")

def create_graph(tx, triples):
    for subj, pred, obj in triples:
        subj_name = extract_name(subj)
        pred_name = extract_name(pred)
        obj_name = extract_name(obj)
        tx.run("MERGE (s:Resource {uri: $subj, name: $subj_name})", subj=str(subj), subj_name=str(subj_name))
        tx.run("MERGE (o:Resource {uri: $obj, name: $obj_name})", obj=str(obj), obj_name=str(obj_name))

        tx.run("""
            MATCH (s:Resource {uri: $subj})
            MATCH (o:Resource {uri: $obj})
           MERGE (s)-[:RELATION {name: $pred_name, uri: $pred }]->(o)
            """, subj=str(subj), pred=str(pred), obj=str(obj), pred_name=str(pred_name))


def load_file_db(filename):
    g = Graph()

    g.parse(filename, format="ttl")
    batch_size = 50
    triples = g.triples((None, None, None))

    batch = []
    count = 0

    with driver.session() as session:
        all_nodes_query = "USE neo4j MATCH (n) DETACH DELETE n"
        result = session.run(all_nodes_query)
        for triple in triples:
            batch.append(triple)
            count += 1
            if count % batch_size == 0:
                session.write_transaction(create_graph, batch)
                batch = []
            # if count > 50:
            #     break
        if batch:
            session.write_transaction(create_graph, batch)

    driver.close()
    print("OWL file imported successfully.")



if __name__=='__main__':
    g = Graph()
    filename = "your_file.ttl"
    g.parse(filename, format="ttl")
    # Iterate through all triples
    print("All triples in the OWL file:")
    index = 0
    for subj, pred, obj in g:
        print(f"Subject: {subj}, Predicate: {pred}, Object: {obj}")
        index = index + 1
        if index > 3:
            break

    # Iterate through all classes
    print("\nClasses:")
    index = 0
    for cls in g.subjects(RDF.type, OWL.Class):
        print(f"Class: {cls}")
        index = index + 1
        if index > 3:
            break

    # Iterate through all object properties
    print("\nObject Properties:")
    index = 0
    for prop in g.subjects(RDF.type, OWL.ObjectProperty):
        print(f"Object Property: {prop}")
        index = index + 1
        if index > 3:
            break

    # Iterate through all data properties
    print("\nData Properties:")
    index = 0
    for prop in g.subjects(RDF.type, OWL.DatatypeProperty):
        print(f"Data Property: {prop}")
        index = index + 1
        if index > 3:
            break

    # Iterate through all individuals
    print("\nIndividuals:")
    index = 0
    for indiv in g.subjects(RDF.type, OWL.NamedIndividual):
        print(f"Individual: {indiv}")
        index = index + 1
        if index > 3:
            break


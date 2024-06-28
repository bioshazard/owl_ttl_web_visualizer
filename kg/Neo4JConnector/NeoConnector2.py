
from neo4j import GraphDatabase, basic_auth

from DataObject.SubGraphResult import BigNode,  SimpleNode
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from constanst import NEO4J_URI, NEO4J_AUTH

class NeoConnector2:
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=NEO4J_AUTH)

    def close(self):
        self.driver.close()

    def get_general_graph(self):
        nodes = []
        nodes_ids = []
        links = []
        with self.driver.session() as session:
            all_nodes_query = "USE neo4j MATCH (n) RETURN n LIMIT 10"
            result = session.run(all_nodes_query)
            all_nodes = [record["n"] for record in result]
            for node in all_nodes:
                node_id = node.id
                nodes_ids.append(node_id)
                nodes.append(BigNode('Record', node_id, 0,
                            SimpleNode(node['name'], "Record",
                                          node_id)))

            # Fetch connections for these nodes
            initial_nodes = nodes.copy()
            for node in initial_nodes:
                node_id = node.id
                records, summary, keys = self.driver.execute_query(
                    "USE neo4j "
                    "MATCH (p)-[r1]-(k) "
                    "WHERE ID(p)=$id and NOT ID(k) in $ids "
                    "with p, k, r1 ORDER BY r1.name DESC "
                    "return p, k, head(collect(r1)) AS r "
                    "LIMIT 5",
                    database_="neo4j", id=int(node_id), ids=nodes_ids
                )

                for record in records:
                    p = record['p']
                    k = record['k']
                    p_id = p.id
                    k_id = k.id
                    node.increase_connections()
                    if k_id not in nodes_ids:
                        new_node = BigNode("Record", k_id, 1, SimpleNode(k['name'],"Record", k_id))
                        nodes.append(
                            new_node
                        )
                        nodes_ids.append(k_id)
                    else:
                        linked_node = [n for n in nodes if n.id == k_id][0]
                        linked_node.increase_connections()
                    links.append({'source': p_id, 'target': k_id, 'name': record['r']['name']})

        return nodes, links, nodes_ids

    def get_search_graph(self, search_str):
        nodes = []
        nodes_ids = []
        links = []
        with self.driver.session() as session:
            records, summary, keys = self.driver.execute_query(
                "USE neo4j MATCH (n) WHERE toLower(n.name) contains toLower($search_str) RETURN n LIMIT 10",
                database_="neo4j", search_str=search_str,
            )
            all_nodes = [record["n"] for record in records]
            for node in all_nodes:
                node_id = node.id
                nodes_ids.append(node_id)
                nodes.append(BigNode('Record', node_id, 0,
                            SimpleNode(node['name'], "Record",
                                          node_id)))
            initial_nodes = nodes.copy()
            # Fetch connections for these nodes
            for node in initial_nodes:
                node_id = node.id
                records, summary, keys = self.driver.execute_query(
                    "USE neo4j "
                    "MATCH (p)-[r1]-(k) "
                    "WHERE ID(p)=$id and NOT ID(k) in $ids "
                    "with p, k, r1 ORDER BY r1.name DESC "
                    "return p, k, head(collect(r1)) AS r "
                    "LIMIT 3",
                    database_="neo4j", id=int(node_id), ids=nodes_ids
                )

                for record in records:
                    p = record['p']
                    k = record['k']
                    p_id = p.id
                    k_id = k.id
                    node.increase_connections()
                    if k_id not in nodes_ids:
                        new_node = BigNode("Record", k_id, 1, SimpleNode(k['name'],"Record", k_id))
                        nodes.append(
                            new_node
                        )
                        nodes_ids.append(k_id)
                    else:
                        linked_node = [n for n in nodes if n.id == k_id][0]
                        linked_node.increase_connections()
                    links.append({'source': p_id, 'target': k_id, 'name': record['r']['name']})

        return nodes, links, nodes_ids

    def expand_node(self, node_id, current_results):
        nodes = []
        nodes_ids = []
        links = []
        with self.driver.session() as session:
            records, summary, keys = self.driver.execute_query(
                "USE neo4j "
                "MATCH (p)-[r]-(k) "
                "WHERE ID(p)=$id AND NOT ID(k) IN $results "
                "return p, k, r LIMIT 3",
                database_="neo4j", id=int(node_id), results=current_results
            )
            for record in records:
                p = record['p']
                k = record['k']
                p_id = p.id
                k_id = k.id
                if k_id not in nodes_ids:
                    new_node = BigNode("Record", k_id, 1, SimpleNode(k['name'],"Record", k_id))
                    nodes.append(
                        new_node
                    )
                    new_node.increase_connections()
                    nodes_ids.append(k_id)
                else:
                    linked_node = [n for n in nodes if n.id == k_id][0]
                    linked_node.increase_connections()
                links.append({'source': p_id, 'target': k_id, 'name': record['r']['name']})

        return nodes, links, nodes_ids
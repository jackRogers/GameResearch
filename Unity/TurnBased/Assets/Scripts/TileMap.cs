using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class TileMap : MonoBehaviour 
{
    public TileType[] tileTypes;
    public GameObject selectedUnit;

    int[,] tiles;
    Node[,] graph;



    int mapSizeX = 10;
    int mapSizeZ = 10;

    void Start()
    {
        //setup units variables

        selectedUnit.GetComponent<Unit>().tileX = (int)selectedUnit.transform.position.x;
        selectedUnit.GetComponent<Unit>().tileZ = (int)selectedUnit.transform.position.z;
        selectedUnit.GetComponent<Unit>().map = this;


        GenerateMapPhysical();
        GeneratePathfindingGraph();
        GenerateMapVisual();

    }

    float CostToEnterTile(int x, int z)
    {
        TileType tt = tileTypes[tiles[x, z]];
        return tt.movementCost;
    }

    void GeneratePathfindingGraph()
    {
        graph = new Node[mapSizeX, mapSizeZ];

        //create array
        for (int x = 0; x < mapSizeX; x++)
        {
            for (int z = 0; z < mapSizeZ; z++)
            {
                graph[x, z] = new Node();
                graph[x, z].x = x;
                graph[x, z].z = z;
            }
        }

        //now add neighbors
        for (int x = 0; x < mapSizeX; x++)
        {
            for (int z = 0; z < mapSizeZ; z++)
            {
                
                if(x > 0)
                    graph[x, z].neighbors.Add(graph[x-1, z]);
                if(x < mapSizeX-1)
                    graph[x, z].neighbors.Add(graph[x+1, z]);
                if(z > 0)
                    graph[x, z].neighbors.Add(graph[x, z-1]);
                if(z < mapSizeZ-1)
                    graph[x, z].neighbors.Add(graph[x, z+1]);
                
            }
        }
    }

    void GenerateMapPhysical(){
        tiles = new int[mapSizeX, mapSizeZ];

        //initialize our map tiles to be grass
        for (int x = 0; x < mapSizeX; x++)
        {
            for (int z = 0; z < mapSizeZ; z++)
            {
                tiles[x, z] = 0;
            }

        }
        tiles[4,4] = 2;
        tiles[5,4] = 2;
        tiles[6,4] = 2;
        tiles[7,4] = 2;
        tiles[8,4] = 2;

        tiles[4,5] = 2;
        tiles[4,6] = 2;
        tiles[8,5] = 2;
        tiles[8,6] = 2;

        tiles[5,2] = 1;
        tiles[4,2] = 1;
        tiles[3,3] = 1;
        tiles[2,3] = 1;
    }

    void GenerateMapVisual()
    {
        for (int x = 0; x < mapSizeX; x++)
        {
            for (int z = 0; z < mapSizeZ; z++)
            {
                TileType tt = tileTypes[tiles[x, z]];
                GameObject go = (GameObject)Instantiate(tt.tileVisualPrefab, new Vector3(x, 0, z), Quaternion.identity);

                ClickableTile ct = go.GetComponent <ClickableTile>();
                ct.tileX = x;
                ct.tileZ = z;
                ct.map = this;
            }

        }
    }

    public Vector3 TileCoordToWorldCoord(int x, int z) {
        return new Vector3(x, 0, z);
    }

    public void GeneratePathTo(int x, int z)
    {
        //clear out units path
        selectedUnit.GetComponent<Unit>().currentPath = null;

//        selectedUnit.GetComponent<Unit>().tileX = x;
//        selectedUnit.GetComponent<Unit>().tileZ = z;
//        selectedUnit.transform.position = TileCoordToWorldCoord(x, z);

        Dictionary<Node,float> dist = new Dictionary<Node, float>();
        Dictionary<Node,Node> prev = new Dictionary<Node, Node>();

        List<Node> unvisited = new List<Node>();

        Node source = graph[
                          selectedUnit.GetComponent<Unit>().tileX,
                          selectedUnit.GetComponent<Unit>().tileZ
                            ];
        Node target = graph[
                            x,
                            z
                            ];
        dist[source] = 0;
        prev[source] = null;

        //initialize everything to have infinity distance
        foreach (Node v in graph)
        {
            if (v != source)
            {
                dist[v] = Mathf.Infinity;
                prev[v] = null;
            }
            unvisited.Add(v);
        }

        while (unvisited.Count > 0)
        {
            //is unvisted node with the smallest distance
            Node u = null;

            foreach (Node possibleU in unvisited)
            {
                if (u == null || dist[possibleU] < dist[u])
                    u = possibleU;
                 
            }

            if (u == target)
            {
                break;
            }
            unvisited.Remove(u);
            foreach (Node v in u.neighbors)
            {
                //float alt = dist[u] + u.DistanceTo(v);
                float alt = dist[u] + CostToEnterTile(v.x,v.z);

                if (alt < dist[v])
                {
                    dist[v] = alt;
                    prev[v] = u;
                }
            }
        }

        //if we get here, we either have shortest route to target or there is no route
        if (prev[target] == null)
        {
            //no route between target and the source
            return;
        }

        List<Node> currentPath = new List<Node>();

        Node curr = target;
        while (curr != null)
        {
            currentPath.Add(curr);
            curr = prev[curr];
        }

        //right now currentPath describes route from target to source, now we invert it

        currentPath.Reverse();
        selectedUnit.GetComponent<Unit>().currentPath = currentPath;
    }

    
}

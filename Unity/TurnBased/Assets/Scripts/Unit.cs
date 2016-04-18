using UnityEngine;
using System.Collections;
using System.Collections.Generic;


public class Unit : MonoBehaviour {
    public int tileX;
    public int tileZ;
    public TileMap map;

    public List<Node> currentPath = null;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
        if (currentPath != null)
        {
            int currNode = 0;
            while (currNode < currentPath.Count-1)
            {
                Vector3 start = map.TileCoordToWorldCoord(currentPath[currNode].x,currentPath[currNode].z) + new Vector3(0,1.5f,0);
                Vector3 end = map.TileCoordToWorldCoord(currentPath[currNode+1].x,currentPath[currNode+1].z) + new Vector3(0,1.5f,0);
                Debug.DrawLine(start, end,Color.red);
                currNode++;
            }
        }
	}
}

using UnityEngine;
using System.Collections;
using System.Collections.Generic;


public class Unit : MonoBehaviour {
    public int tileX;
    public int tileZ;
    public TileMap map;

    public List<Node> currentPath = null;


    int moveSpeed = 3;

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

    public void MoveNextTile(){
        float remainingMovement = moveSpeed;
        while (remainingMovement > 0) {
            if (currentPath == null)
            {
                return;
            }
            //figure out movement cost
            remainingMovement -= map.CostToEnterTile(currentPath[0].x,currentPath[0].z,currentPath[1].x,currentPath[1].z);

            tileX = currentPath[1].x;
            tileZ = currentPath[1].z;


            //now grab new first node and move there
            transform.position = map.TileCoordToWorldCoord(tileX,tileZ);

            //remove old current tille
            currentPath.RemoveAt(0);


            if (currentPath.Count == 1)
            {
                //one tile left - must be dest - lets clear our pathfinding info
                currentPath = null;
            }

        }
    }
}

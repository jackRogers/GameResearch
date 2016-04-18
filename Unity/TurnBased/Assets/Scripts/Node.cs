using UnityEngine;
using System.Collections.Generic;

public class Node {
    public  List<Node> neighbors;
    public int x;
    public int z;

    public Node()
    {
        neighbors = new List<Node>();
    }

    public float DistanceTo(Node n)
    {
        return Vector2.Distance(
            new Vector2(x,z),
            new Vector2(n.x,n.z));
    }
}

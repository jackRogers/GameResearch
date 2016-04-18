using UnityEngine;
using System.Collections;

public class ClickableTile : MonoBehaviour {
    public int tileX;
    public int tileZ;
    public TileMap map;

    void OnMouseUp()
    {
        Debug.Log("Click");
        map.GeneratePathTo(tileX, tileZ);

    }
}

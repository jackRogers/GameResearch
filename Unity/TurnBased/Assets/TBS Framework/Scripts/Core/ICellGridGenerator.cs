using System.Collections.Generic;
using UnityEngine;

public abstract class ICellGridGenerator : MonoBehaviour
{
    public Transform CellsParent;
    public abstract List<Cell> GenerateGrid();
}


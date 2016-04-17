using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class CustomObstacleGenerator : MonoBehaviour
{
    public Transform ObstaclesParent;
    public CellGrid CellGrid;

    public void Start()
    {
        StartCoroutine(SpawnObstacles());
    }
    public IEnumerator SpawnObstacles()
    {
        while (CellGrid.Cells == null)
        {
            yield return 0;
        }

        var cells = CellGrid.Cells;

        for (int i = 0; i < ObstaclesParent.childCount; i++)
        {
            var obstacle = ObstaclesParent.GetChild(i);

            var cell = cells.OrderBy(h => Math.Abs((h.transform.position - obstacle.transform.position).magnitude)).First();
            if (!cell.IsTaken)
            {
                cell.IsTaken = true;
                Vector3 offset = new Vector3(0, 0, cell.GetCellDimensions().z);
                obstacle.position = cell.transform.position - offset;
            }
            else
            {
                Destroy(obstacle.gameObject);
            }
        }
    }

    public void SnapToGrid()
    {
        List<Transform> cells = new List<Transform>();

        foreach (Transform cell in CellGrid.transform)
        {
            cells.Add(cell);
        }

        foreach (Transform obstacle in ObstaclesParent)
        {
            var closestCell = cells.OrderBy(h => Math.Abs((h.transform.position - obstacle.transform.position).magnitude)).First();
            if (!closestCell.GetComponent<Cell>().IsTaken)
            {
                Vector3 offset = new Vector3(0, 0, closestCell.GetComponent<Cell>().GetCellDimensions().z);
                obstacle.position = closestCell.transform.position - offset;
            }
        }
    }
}


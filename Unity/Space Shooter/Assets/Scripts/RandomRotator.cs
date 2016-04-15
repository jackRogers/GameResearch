using UnityEngine;
using System.Collections;

public class RandomRotator : MonoBehaviour {
    private Rigidbody rb;
    public float tumble;

	// Use this for initialization
	void Start () {
        rb = GetComponent<Rigidbody> ();
        //rb.angularVelocity = Random.value()
        rb.angularVelocity = Random.insideUnitSphere * tumble;
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}

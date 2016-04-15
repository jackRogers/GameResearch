using UnityEngine;
using System.Collections;

[System.Serializable]
public class Boundary
{
	public float xMin, xMax, zMin, zMax;

}

public class PlayerController : MonoBehaviour 
{
	
	private Rigidbody rb;
    private AudioSource audi;
	public float speed;
	public Boundary boundary;
	public float tilt;

	public GameObject shot;
	public Transform shotSpawn;

    private float nextFire;
    public float fireRate;

	// Use this for initialization
	void Start () 
	{
		rb = GetComponent<Rigidbody> ();
        audi = GetComponent<AudioSource>();
	}

	void Update ()
	{
        if (Input.GetButton("Fire1") && Time.time > nextFire) 
        {
            nextFire = Time.time + fireRate;
            Instantiate(shot, shotSpawn.position, shotSpawn.rotation);
            audi.Play();
        }
    }

	// Update is called once per frame
	void FixedUpdate () 
	{
		float moveHorizonal = Input.GetAxis ("Horizontal");
		float moveVertical = Input.GetAxis ("Vertical");

		Vector3 movement = new Vector3 (moveHorizonal, 0.0f, moveVertical);
		rb.velocity = movement * speed;

		rb.position = new Vector3 
        (
			Mathf.Clamp (rb.position.x, boundary.xMin, boundary.xMax),
			0.0f,
			Mathf.Clamp (rb.position.z, boundary.zMin, boundary.zMax)
		);

		rb.rotation = Quaternion.Euler (0.0f, 0.0f, rb.velocity.x * -tilt);
	}
}

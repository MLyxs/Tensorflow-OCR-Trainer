import tensorflow as tf

from backend.tf import layers


def get_sequence_lengths(inputs):
    dims = tf.stack([tf.shape(inputs)[1]])
    sequence_length = tf.fill(dims, inputs.shape[0])
    return sequence_length


def feed(features, layer, is_training):
    return _feed_to_layer(features, layer, is_training)


def _feed_to_layer(inputs, layer, is_training):
    layer_type = layer["layer_type"]
    if layer_type == "input_layer":
        return layers.reshape(inputs, layer["shape"], layer["name"])
    if layer_type == "conv2d":
        return layers.conv2d(inputs, num_filters=layer["num_filters"],
                             kernel=layer["kernel_size"])
    if layer_type == "max_pool2d":
        return layers.max_pool2d(inputs, kernel=layer["pool_size"])
    if layer_type == "birnn":
        return layers.bidirectional_rnn(inputs, num_hidden=layer["num_hidden"],
                                        cell_type=layer["cell_type"])
    if layer_type == "mdrnn":
        return layers.mdrnn(inputs, num_hidden=layer["num_hidden"],
                            cell_type=layer["cell_type"])
    if layer_type == "dropout":
        return layers.dropout(inputs, keep_prob=layer["keep_prob"],
                              is_training=is_training)
    if layer_type == "collapse_to_rnn_dims":
        return layers.collapse_to_rnn_dims(inputs)
    if layer_type == "l2_normalize":
        return layers.l2_normalize(inputs, layer["axis"])
    if layer_type == 'batch_norm':
        return layers.batch_norm(inputs, is_training=is_training)
    raise NotImplementedError(layer_type + " layer not implemented.")


def dense_to_sparse(tensor, eos_token=0):
    indices = tf.where(tf.not_equal(tensor, tf.constant(eos_token, dtype=tensor.dtype)))
    values = tf.gather_nd(tensor, indices)
    shape = tf.shape(tensor, out_type=tf.int64)
    return tf.SparseTensor(indices, values, shape)